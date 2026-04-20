import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { migrations } from './migrations';
import { dbModuleModelClasses } from './modules';
import { databaseSchema } from './schema';

const adapter = new SQLiteAdapter({
  schema: databaseSchema,
  migrations,
  dbName: 'lingxi_pavilion',
  onSetUpError: (error) => {
    console.error('[db] WatermelonDB setup error', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: dbModuleModelClasses,
});

export type AppDatabase = typeof database;
