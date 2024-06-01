import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface FunctionStoreTypes {
  Product: number | null;
  setProduct: (data: number | null) => void;
}

export const useProductSelectionStore = create<FunctionStoreTypes>()(
  devtools((set) => ({
    Product: null,
    setProduct(data) {
      set((state) => ({ Product: data }));
    },
  }))
);
