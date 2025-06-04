import CryptoJS from 'crypto-js';

const HASH_SECRET_KEY = import.meta.env.VITE_HASH_SECRET_KEY || 'default-key';

export const encryptLoginData = (email, password) => {
    try {
        console.log('Encryption key:', HASH_SECRET_KEY);
        console.log('Original email:', email);
        console.log('Original password:', password);

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

        console.log('Encrypted email:', encryptedEmail);
        console.log('Encrypted password:', encryptedPassword);

        return { encryptedEmail, encryptedPassword };
    } catch (error) {
        console.error("❌ Encryption error:", error);
        throw new Error("Failed to encrypt login data: " + error.message);
    }
}; 