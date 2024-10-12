import { Id } from '@/convex/_generated/dataModel';
import { create } from 'zustand';

type DrawerSeeMore = {
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
    id: any,
};

export const useDrawerSeeMore = create<DrawerSeeMore>((set) => ({
    id: "",
    isOpen: false,
    onOpen: (id) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, }),
}));