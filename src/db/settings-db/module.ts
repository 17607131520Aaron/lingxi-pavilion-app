import { Setting } from './Setting.model';
import { settingsTableSchema } from './settings.schema';

import type { Model } from '@nozbe/watermelondb';
import type { TableSchema } from '@nozbe/watermelondb/Schema';
import type { MigrationSteps } from '~/db/migration-types';

export type ModelClass = typeof Model;

export const settingsDbSchemaVersion = 1;
export const settingsDbMigrationSteps: MigrationSteps = [];

export const settingsDbTableSchemas: TableSchema[] = [settingsTableSchema];
export const settingsDbModelClasses: ModelClass[] = [Setting];
