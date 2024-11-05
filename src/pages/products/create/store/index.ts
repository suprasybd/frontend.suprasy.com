import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CStore {
  count: number;
  increment: () => void;
}

export const useCreateCountStore = create<CStore>()(
  devtools((set) => ({
    count: 0,
    increment() {
      set((state) => ({ count: state.count + 1 }));
    },
  }))
);
