import { tableSchema } from '@nozbe/watermelondb';

export const settingsTableSchema = tableSchema({
  name: 'settings',
  columns: [
    { name: 'key', type: 'string', isIndexed: true },
    { name: 'value', type: 'string', isOptional: true }, // JSON string (or plain string)
  ],
});
