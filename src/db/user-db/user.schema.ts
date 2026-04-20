import { tableSchema } from '@nozbe/watermelondb';

export const usersTableSchema = tableSchema({
  name: 'users',
  columns: [
    { name: 'uid', type: 'string', isIndexed: true },
    { name: 'nickname', type: 'string', isOptional: true },
    { name: 'avatar_url', type: 'string', isOptional: true },
    { name: 'phone', type: 'string', isOptional: true },
    { name: 'email', type: 'string', isOptional: true },
    { name: 'gender', type: 'string', isOptional: true },
    { name: 'birthday', type: 'number', isOptional: true }, // ms timestamp
    { name: 'extra', type: 'string', isOptional: true }, // JSON string
    { name: 'is_current', type: 'boolean', isIndexed: true },
    { name: 'last_login_at', type: 'number', isOptional: true }, // ms timestamp
  ],
});
