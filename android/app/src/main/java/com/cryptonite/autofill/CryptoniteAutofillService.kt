package com.cryptonite.autofill

import android.app.assist.AssistStructure
import android.os.CancellationSignal
import android.service.autofill.*
import android.util.Log
import android.view.autofill.AutofillId
import android.view.autofill.AutofillValue
import android.widget.RemoteViews
import android.widget.Toast
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class CryptoniteAutofillService : AutofillService() {

    private lateinit var firestore: FirebaseFirestore
    private lateinit var auth: FirebaseAuth

    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
        firestore = FirebaseFirestore.getInstance()
        auth = FirebaseAuth.getInstance()
    }

    override fun onFillRequest(
        request: FillRequest,
        cancellationSignal: CancellationSignal,
        callback: FillCallback
    ) {
        Log.d("CryptoniteAutofill", "onFillRequest çağrıldı")

        try {
            val structure = request.fillContexts.last().structure
            val usernameIds = mutableListOf<AutofillId>()
            val passwordIds = mutableListOf<AutofillId>()

            val targetPackage = structure.activityComponent?.packageName
            Log.d("CryptoniteAutofill", "Target package = $targetPackage")

            // Form alanlarını tara
            for (i in 0 until structure.windowNodeCount) {
                val root = structure.getWindowNodeAt(i).rootViewNode
                traverseNode(root, usernameIds, passwordIds)
            }

            if (usernameIds.isEmpty() && passwordIds.isEmpty()) {
                callback.onSuccess(FillResponse.Builder().build())
                return
            }

            val currentUser = auth.currentUser
            if (currentUser == null) {
                callback.onSuccess(FillResponse.Builder().build())
                return
            }

            val userDoc = firestore.collection("users").document(currentUser.uid)
            val vaultCol = userDoc.collection("vault")

            // Önce uygulamaya özel kayıtları bul
            val query = if (!targetPackage.isNullOrBlank()) {
                vaultCol.whereEqualTo("packageName", targetPackage)
            } else {
                vaultCol
            }

            query.get()
                .addOnSuccessListener { docs ->
                    val responseBuilder = FillResponse.Builder()

                    val resultDocs = if (docs.isEmpty && !targetPackage.isNullOrBlank()) {
                        Log.d("CryptoniteAutofill", "Uygulamaya özel kayıt yok, fallback tüm kayıtlar")
                        emptyList()
                    } else {
                        docs.documents
                    }

                    // Eğer özel kayıt yoksa → fallback tüm kayıtları çek
                    if (resultDocs.isEmpty() && !targetPackage.isNullOrBlank()) {
                        vaultCol.get()
                            .addOnSuccessListener { fallbackDocs ->
                                buildDatasets(
                                    fallbackDocs.documents,
                                    usernameIds,
                                    passwordIds,
                                    responseBuilder
                                )
                                addSaveInfo(responseBuilder, usernameIds, passwordIds)
                                callback.onSuccess(responseBuilder.build())
                            }
                            .addOnFailureListener { e ->
                                Log.e("CryptoniteAutofill", "Firestore fallback hata: ${e.message}", e)
                                callback.onFailure("Veri okunamadı")
                            }
                        return@addOnSuccessListener
                    }

                    buildDatasets(resultDocs, usernameIds, passwordIds, responseBuilder)
                    addSaveInfo(responseBuilder, usernameIds, passwordIds)
                    callback.onSuccess(responseBuilder.build())
                }
                .addOnFailureListener { e ->
                    Log.e("CryptoniteAutofill", "Firestore hata: ${e.message}", e)
                    callback.onFailure("Veri okunamadı")
                }

        } catch (e: Exception) {
            Log.e("CryptoniteAutofill", "FillRequest hata: ${e.message}", e)
            callback.onFailure("Autofill response oluşturulamadı")
        }
    }

    override fun onSaveRequest(request: SaveRequest, callback: SaveCallback) {
        Log.d("CryptoniteAutofill", "onSaveRequest çağrıldı")

        try {
            val currentUser = auth.currentUser
            if (currentUser == null) {
                callback.onFailure("Giriş yapmamış kullanıcı")
                return
            }

            val context = request.fillContexts.lastOrNull()
            val structure = context?.structure ?: run {
                callback.onFailure("Form bulunamadı")
                return
            }

            val values = extractValues(structure)
            val username = values.first
            val password = values.second
            val pkg = structure.activityComponent?.packageName ?: ""

            val userDoc = firestore.collection("users").document(currentUser.uid)
            val vaultCol = userDoc.collection("vault")

            when {
                !username.isNullOrBlank() && password.isNullOrBlank() -> {
                    val data = hashMapOf(
                        "appName" to (pkg.substringAfterLast('.').replaceFirstChar { it.uppercaseChar() }),
                        "packageName" to pkg,
                        "url" to "",
                        "username" to username,
                        "password" to ""
                    )
                    vaultCol.add(data)
                    Toast.makeText(applicationContext, "Cryptonite: kullanıcı adı/e-posta kaydedildi", Toast.LENGTH_SHORT).show()
                    callback.onSuccess()
                }
                !password.isNullOrBlank() && username.isNullOrBlank() -> {
                    vaultCol.orderBy("username").limitToLast(1).get()
                        .addOnSuccessListener { snap ->
                            if (!snap.isEmpty) {
                                val lastDoc = snap.documents.first()
                                lastDoc.reference.update("password", password)
                                Toast.makeText(applicationContext, "Cryptonite: şifre güncellendi", Toast.LENGTH_SHORT).show()
                            }
                            callback.onSuccess()
                        }
                }
                !username.isNullOrBlank() && !password.isNullOrBlank() -> {
                    val data = hashMapOf(
                        "appName" to (pkg.substringAfterLast('.').replaceFirstChar { it.uppercaseChar() }),
                        "packageName" to pkg,
                        "url" to "",
                        "username" to username,
                        "password" to password
                    )
                    vaultCol.add(data)
                    Toast.makeText(applicationContext, "Cryptonite: kayıt eklendi", Toast.LENGTH_SHORT).show()
                    callback.onSuccess()
                }
            }

        } catch (e: Exception) {
            Log.e("CryptoniteAutofill", "SaveRequest hata: ${e.message}", e)
            callback.onFailure("Kaydedilemedi")
        }
    }

    // ----------- yardımcılar -----------

    private fun buildDatasets(
        docs: List<com.google.firebase.firestore.DocumentSnapshot>,
        usernameIds: List<AutofillId>,
        passwordIds: List<AutofillId>,
        responseBuilder: FillResponse.Builder
    ) {
        for (doc in docs) {
            val appName = doc.getString("appName") ?: "App"
            val username = doc.getString("username") ?: ""
            val password = doc.getString("password") ?: ""

            val label = if (username.isNotEmpty()) "$appName ($username)" else appName
            val presentation = RemoteViews(
                applicationContext.packageName,
                android.R.layout.simple_list_item_1
            )
            presentation.setTextViewText(android.R.id.text1, label)

            // 🔑 Tek dataset: hem username hem password aynı kartta
            val datasetBuilder = Dataset.Builder(presentation)

            usernameIds.forEach { id ->
                datasetBuilder.setValue(id, AutofillValue.forText(username), presentation)
            }
            passwordIds.forEach { id ->
                datasetBuilder.setValue(id, AutofillValue.forText(password), presentation)
            }

            responseBuilder.addDataset(datasetBuilder.build())
        }
    }

    private fun traverseNode(
        node: AssistStructure.ViewNode,
        usernames: MutableList<AutofillId>,
        passwords: MutableList<AutofillId>
    ) {
        val allHints = listOfNotNull(
            node.hint,
            node.idEntry,
            node.autofillHints?.joinToString(","),
            node.text?.toString()
        ).joinToString(" ").lowercase()

        node.autofillId?.let { id ->
            if (allHints.contains("user") ||
                allHints.contains("email") ||
                allHints.contains("mail") ||
                allHints.contains("login") ||
                allHints.contains("id") ||
                allHints.contains("phone") ||
                allHints.contains("tel")
            ) {
                usernames.add(id)
            }
            if (allHints.contains("pass") ||
                allHints.contains("pwd") ||
                allHints.contains("password")
            ) {
                passwords.add(id)
            }
        }

        for (i in 0 until node.childCount) {
            traverseNode(node.getChildAt(i), usernames, passwords)
        }
    }

    private fun addSaveInfo(
        responseBuilder: FillResponse.Builder,
        usernameIds: List<AutofillId>,
        passwordIds: List<AutofillId>
    ) {
        if (usernameIds.isNotEmpty() && passwordIds.isEmpty()) {
            val saveInfo = SaveInfo.Builder(SaveInfo.SAVE_DATA_TYPE_USERNAME, usernameIds.toTypedArray())
                .setFlags(SaveInfo.FLAG_SAVE_ON_ALL_VIEWS_INVISIBLE or SaveInfo.FLAG_DELAY_SAVE)
                .build()
            responseBuilder.setSaveInfo(saveInfo)
            return
        }

        if (passwordIds.isNotEmpty() && usernameIds.isEmpty()) {
            val saveInfo = SaveInfo.Builder(SaveInfo.SAVE_DATA_TYPE_PASSWORD, passwordIds.toTypedArray())
                .setFlags(SaveInfo.FLAG_SAVE_ON_ALL_VIEWS_INVISIBLE or SaveInfo.FLAG_DELAY_SAVE)
                .build()
            responseBuilder.setSaveInfo(saveInfo)
            return
        }

        if (usernameIds.isNotEmpty() && passwordIds.isNotEmpty()) {
            val ids = (usernameIds + passwordIds).toTypedArray()
            val type = SaveInfo.SAVE_DATA_TYPE_USERNAME or SaveInfo.SAVE_DATA_TYPE_PASSWORD
            val saveInfo = SaveInfo.Builder(type, ids)
                .setFlags(SaveInfo.FLAG_SAVE_ON_ALL_VIEWS_INVISIBLE or SaveInfo.FLAG_DELAY_SAVE)
                .build()
            responseBuilder.setSaveInfo(saveInfo)
        }
    }

    private fun extractValues(structure: AssistStructure): Pair<String?, String?> {
        var foundUser: String? = null
        var foundPass: String? = null

        fun walk(node: AssistStructure.ViewNode) {
            val hints = listOfNotNull(
                node.hint,
                node.idEntry,
                node.autofillHints?.joinToString(",")
            ).joinToString(" ").lowercase()

            val v = node.autofillValue
            if (v != null && v.isText) {
                val text = v.textValue?.toString()
                if (text != null) {
                    if (foundUser == null && (hints.contains("user") ||
                                hints.contains("email") ||
                                hints.contains("mail") ||
                                hints.contains("login") ||
                                hints.contains("id") ||
                                hints.contains("phone") ||
                                hints.contains("tel"))) {
                        foundUser = text
                    } else if (foundPass == null && (hints.contains("pass") ||
                                hints.contains("pwd") ||
                                hints.contains("password"))) {
                        foundPass = text
                    }
                }
            }
            for (i in 0 until node.childCount) walk(node.getChildAt(i))
        }

        for (i in 0 until structure.windowNodeCount) {
            walk(structure.getWindowNodeAt(i).rootViewNode)
        }
        return Pair(foundUser, foundPass)
    }
}
