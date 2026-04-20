import { appSchema } from '@nozbe/watermelondb';

import { dbModuleTableSchemas, dbSchemaVersion } from './modules';

export const schemaVersion = dbSchemaVersion;

export const databaseSchema = appSchema({
  version: schemaVersion,
  tables: dbModuleTableSchemas,
});
