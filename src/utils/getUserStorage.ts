import useAuthStore from '~/stores/useAuthStore';

export const getAuthToken = (): string | null => {
  const { accessToken } = useAuthStore.getState();

  if (!accessToken || typeof accessToken !== 'string') {
    return null;
  }

  return accessToken;
};
