import { create } from 'zustand';

type EditFormTypes = {
    isOpen: boolean;
    onOpen: (id: string, tab: string) => void;
    onClose: () => void;
    id: any,
    tab: any,
};

export const useEditForms = create<EditFormTypes>((set) => ({
    id: undefined,
    tab: undefined,
    isOpen: false,
    onOpen: (id) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined, tab: undefined }),
}));