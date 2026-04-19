import { createMMKV, type MMKV } from 'react-native-mmkv';

const STORAGE_ID = 'linggoutong-storage';
const JSON_PREFIX = '__MMKV_JSON__:';
/** Older builds stored `null` as this string; still read for one-off migration. */
const LEGACY_NULL_TOKEN = '__MMKV_NULL__';

type PrimitiveValue = string | number | boolean;
type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export type StorageValue = PrimitiveValue | JsonValue | ArrayBuffer;

class Storage {
  private readonly instance: MMKV;

  constructor(private readonly id: string = STORAGE_ID) {
    this.instance = createMMKV({ id: this.id });
  }

  setItemSync(key: string, value: StorageValue): void {
    this.instance.set(key, this.encode(value));
  }

  getItemSync<T extends StorageValue = StorageValue>(key: string): T | null {
    const raw = this.instance.getString(key);
    if (raw !== undefined) {
      return this.decode(raw) as T | null;
    }

    const boolValue = this.instance.getBoolean(key);
    if (boolValue !== undefined) {
      return boolValue as T;
    }

    const numValue = this.instance.getNumber(key);
    if (numValue !== undefined) {
      return numValue as T;
    }

    const bufferValue = this.instance.getBuffer(key);
    if (bufferValue !== undefined) {
      return bufferValue as T;
    }

    return null;
  }

  async setItem(key: string, value: StorageValue): Promise<void> {
    this.setItemSync(key, value);
  }

  async getItem<T extends StorageValue = StorageValue>(key: string): Promise<T | null> {
    return this.getItemSync<T>(key);
  }

  removeItem(key: string): boolean {
    return this.instance.remove(key);
  }

  clear(): void {
    this.instance.clearAll();
  }

  has(key: string): boolean {
    return this.instance.contains(key);
  }

  keys(): string[] {
    return this.instance.getAllKeys();
  }

  /** Total storage size in bytes (same as {@link byteSize}). */
  get size(): number {
    return this.instance.byteSize;
  }

  /** Total storage size in bytes. */
  get byteSize(): number {
    return this.instance.byteSize;
  }

  /** Number of key/value pairs. */
  get length(): number {
    return this.instance.length;
  }

  trim(): void {
    this.instance.trim();
  }

  private encode(value: StorageValue): string | number | boolean | ArrayBuffer {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (value instanceof ArrayBuffer) {
      return value;
    }

    // null, objects, arrays → JSON envelope (stored as MMKV string; matches library hooks pattern)
    return `${JSON_PREFIX}${JSON.stringify(value)}`;
  }

  private decode(raw: string | number | boolean | undefined): StorageValue | null {
    if (raw === undefined) {
      return null;
    }

    if (typeof raw !== 'string') {
      return raw;
    }

    if (raw === LEGACY_NULL_TOKEN) {
      return null;
    }

    if (raw.startsWith(JSON_PREFIX)) {
      const payload = raw.slice(JSON_PREFIX.length);

      try {
        return JSON.parse(payload) as JsonValue;
      } catch {
        return null;
      }
    }

    return raw;
  }
}

const storage = new Storage();

export { Storage };
export default storage;
