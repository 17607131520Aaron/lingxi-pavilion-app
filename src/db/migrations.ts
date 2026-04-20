import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

import { dbMigrationSteps, dbSchemaVersion } from './modules';

export const migrations = schemaMigrations({
  // Keep in sync with `schemaVersion`
  migrations: dbMigrationSteps,
});

export const schemaVersion = dbSchemaVersion;
