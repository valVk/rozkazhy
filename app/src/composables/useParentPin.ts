import { Preferences } from "@capacitor/preferences";

const HASH_KEY = "parent_pin_hash";
const SALT_KEY = "parent_pin_salt";

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return bytesToHex(arr.buffer);
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(salt + pin);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(digest);
}

export function useParentPin() {
  async function hasPinSet(): Promise<boolean> {
    const { value } = await Preferences.get({ key: HASH_KEY });
    return !!value;
  }

  async function createPin(pin: string): Promise<void> {
    const salt = randomSalt();
    const hash = await hashPin(pin, salt);
    await Preferences.set({ key: SALT_KEY, value: salt });
    await Preferences.set({ key: HASH_KEY, value: hash });
  }

  async function verifyPin(pin: string): Promise<boolean> {
    const { value: salt } = await Preferences.get({ key: SALT_KEY });
    const { value: storedHash } = await Preferences.get({ key: HASH_KEY });
    if (!salt || !storedHash) return false;
    const hash = await hashPin(pin, salt);
    return hash === storedHash;
  }

  return { hasPinSet, createPin, verifyPin };
}
