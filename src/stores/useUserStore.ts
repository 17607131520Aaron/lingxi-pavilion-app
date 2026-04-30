import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getUserInfo, type UserInfo } from '~/services/userServices';
import storage from '~/utils/storage';

interface UserState {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchUserInfo: () => Promise<void>;
  setUserInfo: (userInfo: UserInfo | null) => void;
  clearUserInfo: () => void;
}

type UserStore = UserState & UserActions;

interface PersistedState {
  userInfo: UserInfo | null;
}

const initialState: UserState = {
  userInfo: null,
  isLoading: false,
  error: null,
};

const mmkvStorage = createJSONStorage<PersistedState>(() => ({
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

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchUserInfo: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getUserInfo();
          if (response.data) {
            set({ userInfo: response.data, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : '获取用户信息失败';
          set({ error: message, isLoading: false });
        }
      },

      setUserInfo: (userInfo) => {
        set({ userInfo });
      },

      clearUserInfo: () => {
        set(initialState);
      },
    }),
    {
      name: 'user-store',
      storage: mmkvStorage,
      partialize: (state) => ({
        userInfo: state.userInfo,
      }),
    },
  ),
);

export default useUserStore;
