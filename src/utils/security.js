import CryptoJS from 'crypto-js';

const getEncryptionKey = () => {
    const isCustomBackend = localStorage.getItem("use_custom_backend") === "true";
    if (isCustomBackend) {
        const customKey = localStorage.getItem("custom_backend_encrypt_key");
        if (customKey) {
            return customKey;
        }
    }
    return import.meta.env.VITE_HASH_SECRET_KEY || 'youshallnotpass';
};

export const encryptLoginData = (email, password) => {
    try {
        const HASH_SECRET_KEY = getEncryptionKey();

        // Convert the strings to WordArray objects
        const emailWordArray = CryptoJS.enc.Utf8.parse(email);
        const passwordWordArray = CryptoJS.enc.Utf8.parse(password);

        // Encrypt using AES with specific configuration
        const encryptedEmail = CryptoJS.AES.encrypt(email, HASH_SECRET_KEY, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        const encryptedPassword = CryptoJS.AES.encrypt(password, HASH_SECRET_KEY, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        return { encryptedEmail, encryptedPassword };
    } catch (error) {
        console.error("❌ Encryption error:", error);
        throw new Error("Failed to encrypt login data: " + error.message);
    }
}; 