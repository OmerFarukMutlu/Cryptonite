package com.cryptonite

import android.content.Intent
import android.provider.Settings
import android.net.Uri
import android.view.autofill.AutofillManager
import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.UIManagerHelper

class AutofillModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AutofillModule"

    @ReactMethod
    fun openAutofillSettings() {
        val context = reactApplicationContext

        try {
            // 📌 1. Resmi Android popup → "Cryptonite'i Autofill sağlayıcısı yap"
            val intent = Intent(Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE)
            intent.data = Uri.parse("package:com.cryptonite/.autofill.CryptoniteAutofillService")
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context.startActivity(intent)
        } catch (e: Exception) {
            try {
                // 📌 2. Fallback → Genel otomatik doldurma ayarları
                val fallbackIntent = Intent("android.settings.AUTOFILL_SETTINGS")
                fallbackIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                context.startActivity(fallbackIntent)
            } catch (e2: Exception) {
                try {
                    // 📌 3. En son çare → Uygulama ayarları
                    val settingsIntent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                    settingsIntent.data = Uri.parse("package:com.cryptonite")
                    settingsIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                    context.startActivity(settingsIntent)
                } catch (_: Exception) {
                    // hiçbir şey açılmazsa sessiz geç
                }
            }
        }
    }

    // 📌 Yeni eklenen metod
    @ReactMethod
    fun requestAutofill(viewTag: Int) {
        try {
            val context = reactApplicationContext
            val afm = context.getSystemService(AutofillManager::class.java)
            val view: View? = UIManagerHelper.getUIManager(context, 0)
                ?.resolveView(viewTag)

            if (view != null) {
                afm?.requestAutofill(view)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
