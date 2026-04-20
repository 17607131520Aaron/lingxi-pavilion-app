import type { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export type MigrationSteps = Parameters<typeof schemaMigrations>[0]['migrations'];
