import { create } from 'zustand';

type DrawerSeeMore = {
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
    id: string,
};

export const useDrawerSeeMore = create<DrawerSeeMore>((set) => ({
    id: "",
    isOpen: false,
    onOpen: (id) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: "" }),
}));