import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface FunctionStoreTypes {
  imagesList: string[];
  setImagesList: (data: string[]) => void;
}

export const useMediaFormStore = create<FunctionStoreTypes>()(
  devtools((set) => ({
    imagesList: [],
    setImagesList(data) {
      set((state) => ({ imagesList: data }));
    },
  }))
);
