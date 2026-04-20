import {
  settingsDbMigrationSteps,
  settingsDbModelClasses,
  settingsDbSchemaVersion,
  settingsDbTableSchemas,
} from './settings-db/module';
import {
  userDbMigrationSteps,
  userDbModelClasses,
  userDbSchemaVersion,
  userDbTableSchemas,
} from './user-db/module';

import type { MigrationSteps } from './migration-types';
import type { TableSchema } from '@nozbe/watermelondb/Schema';

export const dbModuleTableSchemas: TableSchema[] = [
  ...userDbTableSchemas,
  ...settingsDbTableSchemas,
];

export const dbModuleModelClasses = [...userDbModelClasses, ...settingsDbModelClasses];

export const dbSchemaVersion = Math.max(userDbSchemaVersion, settingsDbSchemaVersion);

export const dbMigrationSteps: MigrationSteps = [
  ...userDbMigrationSteps,
  ...settingsDbMigrationSteps,
];
