import * as SecureStore from "expo-secure-store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const KEYS = ["X-Session-Token"] as const;
type SecureStorageKey = (typeof KEYS)[number];

async function store(key: SecureStorageKey, value: string): Promise<void> {
  try {
    return await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error storing value for "${key}": `, error);
  }
}

async function get(key: SecureStorageKey): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting value for "${key}":`, error);
    return null;
  }
}

async function remove(key: SecureStorageKey): Promise<void> {
  try {
    return await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error removing value for "${key}":`, error);
  }
}

export default { store, get, remove };
