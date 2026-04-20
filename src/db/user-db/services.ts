import { Q } from '@nozbe/watermelondb';

import { database } from '~/db';

import type { User } from './User.model';
import type { Collection } from '@nozbe/watermelondb';

export interface UserUpsertInput {
  uid: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  gender?: string | null;
  birthday?: number | null; // ms timestamp
  extra?: unknown;
  isCurrent?: boolean;
  lastLoginAt?: number | null; // ms timestamp
}

function serializeExtra(extra: unknown | undefined): string | null {
  if (extra === undefined) return null;
  if (extra === null) return null;
  try {
    return JSON.stringify(extra);
  } catch {
    return null;
  }
}

function usersCollection(): Collection<User> {
  return database.get<User>('users');
}

export async function listUsers(): Promise<User[]> {
  return await usersCollection().query().fetch();
}

export async function findUserByUid(uid: string): Promise<User | null> {
  const rows = await usersCollection().query(Q.where('uid', uid), Q.take(1)).fetch();
  return rows[0] ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const rows = await usersCollection()
    .query(Q.where('is_current', true), Q.sortBy('updated_at', Q.desc), Q.take(1))
    .fetch();
  return rows[0] ?? null;
}

export async function upsertUser(input: UserUpsertInput): Promise<User> {
  const existing = await findUserByUid(input.uid);

  return await database.write(async () => {
    if (input.isCurrent) {
      const current = await usersCollection().query(Q.where('is_current', true)).fetch();
      await Promise.all(
        current
          .filter((u) => u.uid !== input.uid)
          .map((u) =>
            u.update((rec) => {
              rec.isCurrent = false;
            }),
          ),
      );
    }

    if (existing) {
      return await existing.update((rec) => {
        if (input.nickname !== undefined) rec.nickname = input.nickname;
        if (input.avatarUrl !== undefined) rec.avatarUrl = input.avatarUrl;
        if (input.phone !== undefined) rec.phone = input.phone;
        if (input.email !== undefined) rec.email = input.email;
        if (input.gender !== undefined) rec.gender = input.gender;
        if (input.birthday !== undefined) rec.birthday = input.birthday;
        if (input.lastLoginAt !== undefined) rec.lastLoginAt = input.lastLoginAt;
        if (input.isCurrent !== undefined) rec.isCurrent = input.isCurrent;
        if (input.extra !== undefined) rec.extra = serializeExtra(input.extra);
      });
    }

    return await usersCollection().create((rec) => {
      rec.uid = input.uid;
      rec.nickname = input.nickname ?? null;
      rec.avatarUrl = input.avatarUrl ?? null;
      rec.phone = input.phone ?? null;
      rec.email = input.email ?? null;
      rec.gender = input.gender ?? null;
      rec.birthday = input.birthday ?? null;
      rec.extra = serializeExtra(input.extra);
      rec.isCurrent = input.isCurrent ?? false;
      rec.lastLoginAt = input.lastLoginAt ?? null;
    });
  });
}

export async function setCurrentUserByUid(uid: string): Promise<User | null> {
  const user = await findUserByUid(uid);
  if (!user) return null;

  await database.write(async () => {
    const current = await usersCollection().query(Q.where('is_current', true)).fetch();
    await Promise.all(
      current
        .filter((u) => u.uid !== uid)
        .map((u) =>
          u.update((rec) => {
            rec.isCurrent = false;
          }),
        ),
    );

    await user.update((rec) => {
      rec.isCurrent = true;
    });
  });

  return user;
}

export async function deleteUserByUid(uid: string): Promise<boolean> {
  const user = await findUserByUid(uid);
  if (!user) return false;

  await database.write(async () => {
    await user.markAsDeleted(); // immediate delete (not syncable)
  });

  return true;
}

export async function clearUsers(): Promise<void> {
  const all = await listUsers();
  await database.write(async () => {
    await Promise.all(all.map((u) => u.markAsDeleted()));
  });
}
