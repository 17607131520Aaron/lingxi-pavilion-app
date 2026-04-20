import { Model } from '@nozbe/watermelondb';
import { date, field, text } from '@nozbe/watermelondb/decorators';

export class User extends Model {
  static table = 'users' as const;

  @text('uid') uid!: string;
  @text('nickname') nickname!: string | null;
  @text('avatar_url') avatarUrl!: string | null;
  @text('phone') phone!: string | null;
  @text('email') email!: string | null;
  @text('gender') gender!: string | null;

  @field('birthday') birthday!: number | null;
  @text('extra') extra!: string | null;

  @field('is_current') isCurrent!: boolean;
  @field('last_login_at') lastLoginAt!: number | null;

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
