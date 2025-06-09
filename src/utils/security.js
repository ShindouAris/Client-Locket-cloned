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
        // We no longer encrypt the login data

        const encryptedEmail = email;
        const encryptedPassword = password;

        return { encryptedEmail, encryptedPassword };
    } catch (error) {
        console.error("❌ Encryption error:", error);
        throw new Error("Failed to encrypt login data: " + error.message);
    }
}; 

export const validate_response_data = async (url) => {
    const url_regex = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^\/]+\/o\/[^?]+(\?.*)?$/;

    if (!url_regex.test(url)) {
        return false;
    }
    return true;
}