import { create } from 'zustand';
import { UserType } from './interfaces/userInterface';

export interface AuthStoreType {
  isAuthenticated: boolean;
  user: UserType | object;
  setAuth: (data: AuthStoreType) => void;
}

export const useAuthStore = create<AuthStoreType>((set) => ({
  isAuthenticated: false,
  user: {},
  setAuth(data: AuthStoreType) {
    set(data);
  },
}));
