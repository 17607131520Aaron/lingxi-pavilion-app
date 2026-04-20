import { Model } from '@nozbe/watermelondb';
import { date, text } from '@nozbe/watermelondb/decorators';

export class Setting extends Model {
  static table = 'settings' as const;

  @text('key') key!: string;
  @text('value') value!: string | null;

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
