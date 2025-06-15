import { MMKV } from "react-native-mmkv";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

const ENCRYPTION_KEY = "session-encryption-key";

function fetchOrGenerateEncryptionKey(): string {
  const encryptionKey = SecureStore.getItem(ENCRYPTION_KEY) as string | null;
  if (encryptionKey) {
    return encryptionKey;
  } else {
    const uuid = Crypto.randomUUID();
    SecureStore.setItem(ENCRYPTION_KEY, uuid);
    return uuid;
  }
}

const storage = new MMKV({
  id: "session",
  encryptionKey: fetchOrGenerateEncryptionKey(),
});

export async function getItem(key: string): Promise<string | null> {
  try {
    return storage.getString(key) ?? null;
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    storage.set(key, value);
  } catch {}
}

export async function removeItem(key: string): Promise<void> {
  try {
    storage.delete(key);
  } catch {}
}
