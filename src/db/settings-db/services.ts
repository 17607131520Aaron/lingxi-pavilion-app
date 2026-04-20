import { Q } from '@nozbe/watermelondb';

import { database } from '~/db';

import type { SettingKey } from './keys';
import type { Setting } from './Setting.model';
import type { Collection } from '@nozbe/watermelondb';

function settingsCollection(): Collection<Setting> {
  return database.get<Setting>('settings');
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeJsonStringify(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export async function getSetting(key: SettingKey): Promise<Setting | null> {
  const rows = await settingsCollection().query(Q.where('key', key), Q.take(1)).fetch();
  return rows[0] ?? null;
}

export async function getSettingValue(key: SettingKey): Promise<string | null> {
  const row = await getSetting(key);
  return row?.value ?? null;
}

export async function getSettingJson<T>(key: SettingKey): Promise<T | null> {
  const raw = await getSettingValue(key);
  if (raw === null) return null;
  return safeJsonParse<T>(raw);
}

export async function setSettingJson(key: SettingKey, value: unknown | null): Promise<Setting> {
  const raw = value === null ? null : safeJsonStringify(value);
  return await setSettingValue(key, raw);
}

export async function getSettingValues(keys: SettingKey[]): Promise<Record<string, string | null>> {
  const uniqueKeys = Array.from(new Set(keys));
  if (uniqueKeys.length === 0) return {};

  const rows = await settingsCollection()
    .query(Q.where('key', Q.oneOf(uniqueKeys)))
    .fetch();
  const map: Record<string, string | null> = Object.fromEntries(uniqueKeys.map((k) => [k, null]));
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export async function setSettingValue(key: SettingKey, value: string | null): Promise<Setting> {
  return await database.write(async () => {
    const rows = await settingsCollection().query(Q.where('key', key)).fetch();
    const head = rows[0];
    const duplicates = rows.slice(1);

    if (duplicates.length > 0) {
      await Promise.all(duplicates.map((r) => r.markAsDeleted()));
    }

    if (head) {
      return await head.update((rec) => {
        rec.value = value;
      });
    }

    return await settingsCollection().create((rec) => {
      rec.key = key;
      rec.value = value;
    });
  });
}

export async function deleteSetting(key: SettingKey): Promise<boolean> {
  const row = await getSetting(key);
  if (!row) return false;

  await database.write(async () => {
    await row.markAsDeleted(); // immediate delete (not syncable)
  });

  return true;
}

export async function clearSettings(): Promise<void> {
  const all = await settingsCollection().query().fetch();
  await database.write(async () => {
    await Promise.all(all.map((s) => s.markAsDeleted()));
  });
}
