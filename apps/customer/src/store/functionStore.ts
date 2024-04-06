import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface FunctionStoreTypes {
  function: Record<string, () => void>;
  setFunction: (data: Record<string, () => void>) => void;
  clearModalPath: () => void;
}

export const useFunctionStore = create<FunctionStoreTypes>()(
  devtools((set) => ({
    function: {},
    setFunction(data) {
      set((state) => ({ function: data }));
    },
    clearModalPath() {
      set((state) => ({ function: {} }));
    },
  }))
);
