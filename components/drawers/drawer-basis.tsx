import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const DrawerBasis: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    children,
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <Drawer
            open={isOpen}
            onOpenChange={onChange}
        >
            <DrawerContent className="h-full w-full border-1 border-black dark:border-slate-300">
                <div className="">
                    <div className="flex flex-wrap justify-center items-center w-5/6 m-auto mt-10">
                        {children}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
};


