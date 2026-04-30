import { STORAGE_KEYS } from '~/common/storage-keys';
import storage from '~/utils/storage';

export const getAuthToken = (): string | null => {
  const token = storage.getItemSync<string>(STORAGE_KEYS.AUTH_TOKEN);

  if (!token || typeof token !== 'string') {
    return null;
  }

  return token;
};
