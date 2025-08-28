import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAo9H8GXZWMpBM7AZnxZGZ48qrohikJAaQ",
  authDomain: "cryptonite-bb2dd.firebaseapp.com",
  projectId: "cryptonite-bb2dd",
  storageBucket: "cryptonite-bb2dd.appspot.com",  // ✅ bu haliyle
  messagingSenderId: "648630431800",
  appId: "1:648630431800:web:ac7a731a62a0d57fe736cd"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
