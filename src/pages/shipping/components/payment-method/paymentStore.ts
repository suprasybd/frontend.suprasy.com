import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface PaymentStoreType {
  isModalOpen: boolean;
  toggleModal: () => void;
  params: { update: boolean; paymentId: number } | Record<string, any>;
  clearPaymentModalParams: () => void;
  setPaymentModalParams: (newParams: object) => void;
}

export const usePaymentStore = create<PaymentStoreType>()(
  devtools((set) => ({
    isModalOpen: false,
    toggleModal() {
      set((state) => ({ isModalOpen: !state.isModalOpen }));
    },
    params: {},
    clearPaymentModalParams() {
      set((state) => ({ ...state, params: {} }));
    },
    setPaymentModalParams(newParams: object) {
      set((state) => ({ ...state, params: newParams }));
    },
  }))
);
