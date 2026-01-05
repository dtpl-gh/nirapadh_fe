
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Simple AES-GCM encryption/decryption for development testing

export async function generateKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function importKey(rawKey: string): Promise<CryptoKey> {
    // Validate hex string length for 256-bit key (64 hex chars)
    // For simplicity in this dev util, we'll derive a key from a password string using PBKDF2
    // if it's not a direct key import. But to match "encrypt and decrypt buttons", likely standard usage.
    // Let's implement a simple password-based key derivation for ease of testing.
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(rawKey),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("somesalt"), // In production, salt should be random and stored with ciphertext
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function encrypt(text: string, password: string = "secret"): Promise<string> {
    try {
        const key = await importKey(password);
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedText = new TextEncoder().encode(text);

        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            encodedText
        );

        // Return IV + Ciphertext as hex or base64
        // Using Base64 for easier copy-pasting
        const ivArr = Array.from(iv);
        const encArr = Array.from(new Uint8Array(encrypted));
        // Simple serialization: IV (12 bytes) + Ciphertext
        const combined = new Uint8Array(iv.length + encArr.length);
        combined.set(iv);
        combined.set(encArr, iv.length);

        return btoa(String.fromCharCode(...combined));
    } catch (e) {
        console.error("Encryption failed", e);
        return "";
    }
}

export async function decrypt(encryptedText: string, password: string = "secret"): Promise<string> {
    try {
        const key = await importKey(password);
        const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));

        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.error("Decryption failed", e);
        return "Decryption failed (Invalid key or corrupted data)";
    }
}
