/* global chrome */

// content.js
console.log("🔑 Cryptonite Autofill çalışıyor:", window.location.hostname);

// Örnek: test için localStorage kullan (sonra burayı API bağlayacaksın)
const dummyVault = {
  "linkedin.com": { username: "test@mail.com", password: "123456" },
  "twitter.com": { username: "demo@mail.com", password: "abcdef" }
};

const domain = window.location.hostname.replace("www.", "");
const creds = dummyVault[domain];

if (creds) {
  const userInput =
    document.querySelector('input[type="email"]') ||
    document.querySelector('input[name*="user"]') ||
    document.querySelector('input[name*="login"]');
  const passInput = document.querySelector('input[type="password"]');

  if (userInput && passInput) {
    userInput.value = creds.username;
    passInput.value = creds.password;
    console.log("✅ Cryptonite form doldurdu:", creds.username);
  }
}
