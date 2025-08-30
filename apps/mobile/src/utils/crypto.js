// utils/crypto.js
import CryptoJS from "crypto-js";

const SECRET_KEY = "cryptonite-secret-key"; // ⚠️ gerçek uygulamada environment’dan çekilmeli

export const encryptPassword = (plain) => {
  return CryptoJS.AES.encrypt(plain, SECRET_KEY).toString();
};

export const decryptPassword = (cipher) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    return "";
  }
};
