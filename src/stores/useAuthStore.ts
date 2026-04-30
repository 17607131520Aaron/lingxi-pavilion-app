import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import storage from '~/utils/storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  checkAuth: () => boolean;
}

type AuthStore = AuthState & AuthActions;

interface PersistedAuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const mmkvStorage = createJSONStorage<PersistedAuthState>(() => ({
  getItem: (name: string) => {
    const value = storage.getItemSync<string>(name);
    return value;
  },
  setItem: (name: string, value: string) => {
    storage.setItemSync(name, value);
  },
  removeItem: (name: string) => {
    storage.removeItem(name);
  },
}));

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      clearAuth: () => {
        set({ accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const { accessToken } = get();
        return !!accessToken;
      },
    }),
    {
      name: 'auth-store',
      storage: mmkvStorage,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state?.accessToken) {
            state.isAuthenticated = true;
          }
        };
      },
    },
  ),
);

export default useAuthStore;
