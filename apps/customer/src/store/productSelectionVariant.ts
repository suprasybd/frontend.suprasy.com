import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProductType {
  ProductId: number;
  Variant: string | undefined;
}

export interface FunctionStoreTypes {
  Product: ProductType | null;
  setProduct: (data: ProductType | null) => void;
}

export const useProductSelectionVariantStore = create<FunctionStoreTypes>()(
  devtools((set) => ({
    Product: null,
    setProduct(data) {
      set((state) => ({ Product: data }));
    },
  }))
);
