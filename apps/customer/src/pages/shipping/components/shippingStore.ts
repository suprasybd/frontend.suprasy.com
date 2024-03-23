import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ShippingStoreType {
  isModalOpen: boolean;
  toggleModal: () => void;
  params: { update: boolean; areaId: number } | Record<string, any>;
  clearShippingModalParams: () => void;
  setShippingModalParams: (newParams: object) => void;
}

export const useShippingStore = create<ShippingStoreType>()(
  devtools((set) => ({
    isModalOpen: false,
    toggleModal() {
      set((state) => ({ isModalOpen: !state.isModalOpen }));
    },
    params: {},
    clearShippingModalParams() {
      set((state) => ({ ...state, params: {} }));
    },
    setShippingModalParams(newParams: object) {
      set((state) => ({ ...state, params: newParams }));
    },
  }))
);
