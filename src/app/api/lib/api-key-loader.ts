export let cachedApiKey: string | null = null;
let fetchPromise: Promise<string | null> | null = null;

// Environment variables configuration
const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_TOKEN = process.env.VAULT_TOKEN;
const VAULT_PATH = process.env.VAULT_SECRET_PATH; // e.g. secret/data/myapp/config
const VAULT_KEY_NAME = process.env.VAULT_KEY_NAME || 'api.key'; // The key inside the secret

/**
 * Lazily loads the API key from Vault.
 * Caches the result for subsequent calls.
 */
export async function getApiKey(): Promise<string | null> {
    // Return cached key if available
    if (cachedApiKey) {
        return cachedApiKey;
    }

    // Reuse existing promise if a fetch is already in progress
    if (fetchPromise) {
        return fetchPromise;
    }

    // Start a new fetch
    fetchPromise = fetchFromVault().then((key) => {
        cachedApiKey = key;
        fetchPromise = null; // Clear promise references
        return key;
    });

    return fetchPromise;
}

async function fetchFromVault(): Promise<string | null> {
    // Fallback/Direct check: if API_KEY is set in env and we want to prioritize it or if (not configured)
    // But typically "fetch from Vault" implies we want the dynamic one.
    // We will try Vault if configured, else fallback.

    if (!VAULT_ADDR || !VAULT_TOKEN || !VAULT_PATH) {
        // If Vault is not fully configured, fallback to standard env var if available
        if (process.env.API_KEY) {
            return process.env.API_KEY;
        }
        console.warn('Vault configuration missing (VAULT_ADDR, VAULT_TOKEN, VAULT_SECRET_PATH) and API_KEY not set.');
        return null;
    }

    try {
        const vaultUrl = `${VAULT_ADDR}/v1/${VAULT_PATH}`;
        console.log(`Fetching API Key from Vault at ${VAULT_ADDR}... URL: ${vaultUrl}`);

        const response = await fetch(vaultUrl, {
            method: 'GET',
            headers: {
                'X-Vault-Token': VAULT_TOKEN,
                'Content-Type': 'application/json',
            },
            // fast timeout?
            // signal: ...
        });

        if (!response.ok) {
            throw new Error(`Vault request failed: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();

        // Handle KV v2 structure { data: { data: { ... } } } vs v1 { data: { ... } }
        const secretData = json.data?.data || json.data;

        const apiKey = secretData?.[VAULT_KEY_NAME];

        if (apiKey) {
            console.log('Successfully loaded API Key from Vault');
            return apiKey;
        } else {
            console.warn(`Key '${VAULT_KEY_NAME}' not found in Vault secret.`);
            return process.env.API_KEY || null;
        }

    } catch (error) {
        console.error('Error fetching API Key from Vault:', error);
        // Fallback on error
        return process.env.API_KEY || null;
    }
}
