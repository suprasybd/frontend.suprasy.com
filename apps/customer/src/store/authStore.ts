import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserType } from './interfaces/userInterface';

export interface AuthStoreType {
  isAuthenticated: boolean;
  user: UserType | object;
  setAuth: (data: AuthStoreType) => void;
  login: (data: UserType) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreType>()(
  devtools((set) => ({
    isAuthenticated: true,
    user: {},
    setAuth(data: AuthStoreType) {
      set(data);
    },
    logout() {
      set({ isAuthenticated: false, user: {} });
    },
    login(data: UserType) {
      set({ isAuthenticated: true, user: data });
    },
  }))
);
