import { User } from './User.model';
import { usersTableSchema } from './user.schema';

import type { Model } from '@nozbe/watermelondb';
import type { TableSchema } from '@nozbe/watermelondb/Schema';
import type { MigrationSteps } from '~/db/migration-types';

export type ModelClass = typeof Model;

export const userDbSchemaVersion = 1;
export const userDbMigrationSteps: MigrationSteps = [];

export const userDbTableSchemas: TableSchema[] = [usersTableSchema];
export const userDbModelClasses: ModelClass[] = [User];
