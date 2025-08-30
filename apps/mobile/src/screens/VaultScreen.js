// screens/VaultScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { ThemeContext } from "../theme/ThemeContext";
import { iconSize } from "../theme/theme";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { appMappings } from "../utils/appMappings";
import { Picker } from "@react-native-picker/picker";

export default function VaultScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [vaultItems, setVaultItems] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({ appName: "", username: "", password: "" });
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const appNames = Object.keys(appMappings);

  // ✅ Kullanıcı doğrulama + Firestore dinleme
  useEffect(() => {
    let unsubscribeVault = null;

    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      try {
        if (!user) {
          setVaultItems([]);
          if (unsubscribeVault) unsubscribeVault();
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          return;
        }

        await user.reload();
        const refreshedUser = auth().currentUser;

        if (!refreshedUser.emailVerified) {
          setVaultItems([]);
          if (unsubscribeVault) unsubscribeVault();
          Alert.alert("Doğrulama Gerekli", "Vault’a erişmek için emailini doğrulamalısın.");
          navigation.reset({ index: 0, routes: [{ name: "VerifyEmailPending" }] });
          return;
        }

        unsubscribeVault = firestore()
          .collection("users")
          .doc(refreshedUser.uid)
          .collection("vault")
          .onSnapshot(
            (snapshot) => {
              if (!snapshot || snapshot.empty) {
                setVaultItems([]);
                setFilteredItems([]);
                setLoading(false);
                return;
              }
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setVaultItems(data);
              setFilteredItems(data);
              setLoading(false);
            },
            (error) => {
              console.error("🔥 Firestore onSnapshot error:", error);
              if (error.code !== "permission-denied") {
                Alert.alert("Hata", "Vault verilerine erişim iznin yok.");
              }
              setLoading(false);
            }
          );
      } catch (err) {
        console.error(err);
        setVaultItems([]);
        if (unsubscribeVault) unsubscribeVault();
        Alert.alert("Hata", err.message);
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeVault) unsubscribeVault();
    };
  }, [navigation]);

  // 🔹 Şifre göster/gizle
  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🔹 Panoya kopyala
  const copyToClipboard = (text, label) => {
    Clipboard.setString(text);
    Alert.alert(`${label} kopyalandı!`, text);
  };

  // 🔹 Düzenlemeyi kaydet
  const saveEdit = async () => {
    const user = auth().currentUser;
    if (!user || !currentItem) return;

    if (!currentItem.appName || !currentItem.username || !currentItem.password) {
      Alert.alert("Eksik bilgi", "Tüm alanları doldurun.");
      return;
    }

    const mapping = appMappings[currentItem.appName];
    const packageName = mapping?.packageName || null;
    const url = mapping?.url || "";

    await firestore()
      .collection("users")
      .doc(user.uid)
      .collection("vault")
      .doc(currentItem.id)
      .update({
        appName: currentItem.appName,
        username: currentItem.username,
        password: currentItem.password,
        url,
        packageName,
      });

    setCurrentItem(null);
    setEditModalVisible(false);
  };

  // 🔹 Sil
  const deleteItem = async (id) => {
    const user = auth().currentUser;
    if (!user) return;

    await firestore().collection("users").doc(user.uid).collection("vault").doc(id).delete();
  };

  // 🔹 Yeni kayıt ekle
  const addItem = async () => {
    const user = auth().currentUser;
    if (!user) return;

    if (!newItem.appName || !newItem.username || !newItem.password) {
      Alert.alert("Eksik bilgi", "Lütfen tüm alanları doldurun.");
      return;
    }

    const mapping = appMappings[newItem.appName];
    const packageName = mapping?.packageName || null;
    const url = mapping?.url || "";

    await firestore().collection("users").doc(user.uid).collection("vault").add({
      appName: newItem.appName,
      packageName,
      url,
      username: newItem.username,
      password: newItem.password,
    });

    setNewItem({ appName: "", username: "", password: "" });
    setAddModalVisible(false);
  };

  // 🔹 Arama
  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredItems(vaultItems);
      return;
    }
    const results = vaultItems.filter(
      (item) =>
        (item.appName && item.appName.toLowerCase().includes(search.toLowerCase())) ||
        (item.username && item.username.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredItems(results);
  };

  const clearSearch = () => {
    setSearch("");
    setFilteredItems(vaultItems);
  };

  // 🔹 Kart render
  const renderItem = ({ item }) => {
    const isEmail = item.username.includes("@");
    const label = isEmail ? "Email" : "Kullanıcı adı";
    const icon = isEmail
      ? require("../assets/icons/email.png")
      : require("../assets/icons/user.png");

    return (
      <View
        style={[
          styles.card,
          { borderColor: theme.colors.primary, backgroundColor: theme.colors.card },
        ]}
      >
        <View style={styles.center}>
          <Text style={[styles.site, { color: theme.colors.text }]}>{item.appName}</Text>
          <Text style={[styles.urlText, { color: theme.colors.text }]}>{item.url}</Text>

          <View style={styles.row}>
            <Image source={icon} style={styles.smallIcon} />
            <Text style={[styles.user, { color: theme.colors.text }, styles.ml6]}>
              {item.username}
            </Text>
          </View>

          <View style={styles.row}>
            <Image source={require("../assets/icons/lock2.png")} style={styles.smallIcon} />
            <Text style={[styles.pass, { color: theme.colors.text }, styles.ml6]}>
              {visiblePasswords[item.id] ? item.password : "********"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => copyToClipboard(item.username, label)}>
            <Image source={icon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => copyToClipboard(item.password, "Şifre")}>
            <Image source={require("../assets/icons/key.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePassword(item.id)}>
            <Image
              source={
                visiblePasswords[item.id]
                  ? require("../assets/icons/hide.png")
                  : require("../assets/icons/eye.png")
              }
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setCurrentItem(item); setEditModalVisible(true); }}>
            <Image source={require("../assets/icons/edit.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteItem(item.id)}>
            <Image source={require("../assets/icons/delete.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Başlık */}
      <View style={styles.header}>
        <View style={styles.row}>
          <Image source={require("../assets/icons/lock.png")} style={styles.lockIcon} />
          <Text style={[styles.headerText, { color: theme.colors.text }]}>Vault</Text>
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.button.primary }]}
          onPress={() => setAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* 🔍 Arama */}
      <View style={styles.searchRow}>
        <TextInput
          style={[styles.searchInput, { borderColor: theme.colors.primary, color: theme.colors.text }]}
          placeholder="Ara (Uygulama adı, kullanıcı)..."
          placeholderTextColor={theme.colors.border}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>❌</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🔹 Liste veya boş mesaj */}
      {filteredItems.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>Henüz kayıt yok.</Text>
      ) : (
        <FlatList data={filteredItems} renderItem={renderItem} keyExtractor={(item) => item.id} />
      )}

      {/* ➕ Add Modal */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Yeni Kayıt Ekle</Text>

            <Picker
              selectedValue={newItem.appName}
              onValueChange={(value) => setNewItem((prev) => ({ ...prev, appName: value }))}
              style={[styles.picker, { color: theme.colors.text }]}
            >
              <Picker.Item label="-- Uygulama Seç --" value="" />
              {appNames.map((name) => (
                <Picker.Item key={name} label={name} value={name} />
              ))}
            </Picker>

            <TextInput
              style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
              placeholder="Kullanıcı Adı / Email"
              placeholderTextColor={theme.colors.border}
              value={newItem.username}
              onChangeText={(text) => setNewItem((prev) => ({ ...prev, username: text }))}
            />
            <TextInput
              style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
              placeholder="Şifre"
              placeholderTextColor={theme.colors.border}
              secureTextEntry
              value={newItem.password}
              onChangeText={(text) => setNewItem((prev) => ({ ...prev, password: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.button.danger }]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.button.primary }]}
                onPress={addItem}
              >
                <Text style={styles.modalButtonText}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✏️ Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Kaydı Düzenle</Text>

            <Picker
              selectedValue={currentItem?.appName || ""}
              onValueChange={(value) => setCurrentItem((prev) => ({ ...prev, appName: value }))}
              style={[styles.picker, { color: theme.colors.text }]}
            >
              <Picker.Item label="-- Uygulama Seç --" value="" />
              {appNames.map((name) => (
                <Picker.Item key={name} label={name} value={name} />
              ))}
            </Picker>

            <TextInput
              style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
              placeholder="Kullanıcı Adı / Email"
              placeholderTextColor={theme.colors.border}
              value={currentItem?.username}
              onChangeText={(text) => setCurrentItem((prev) => ({ ...prev, username: text }))}
            />
            <TextInput
              style={[styles.input, { borderColor: theme.colors.primary, color: theme.colors.text }]}
              placeholder="Şifre"
              placeholderTextColor={theme.colors.border}
              secureTextEntry
              value={currentItem?.password}
              onChangeText={(text) => setCurrentItem((prev) => ({ ...prev, password: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.button.danger }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.button.primary }]}
                onPress={saveEdit}
              >
                <Text style={styles.modalButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  lockIcon: { width: iconSize + 4, height: iconSize + 4, marginRight: 8 },
  headerText: { fontSize: 24, fontWeight: "bold" },
  addButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  addButtonText: { color: "white", fontWeight: "bold", fontSize: 18 },
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  searchInput: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16 },
  clearButton: { marginLeft: 8 },
  clearButtonText: { fontSize: 18, color: "red" },
  card: { padding: 15, marginBottom: 10, borderWidth: 1, borderRadius: 8 },
  site: { fontSize: 18, fontWeight: "bold" },
  user: { fontSize: 16 },
  pass: { fontSize: 16 },
  urlText: { fontSize: 12 }, // 🔹 inline kaldırıldı
  smallIcon: { width: iconSize - 8, height: iconSize - 8, resizeMode: "contain" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  icon: { width: iconSize, height: iconSize, resizeMode: "contain" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { width: "85%", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 12, borderRadius: 5, marginBottom: 12, fontSize: 16 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 5, marginLeft: 10 },
  modalButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  center: { alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ml6: { marginLeft: 6 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 14 }, // 🔹 inline kaldırıldı
  picker: { marginBottom: 12 }, // 🔹 margin inline kaldırıldı
});
