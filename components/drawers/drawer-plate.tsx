import { useGetRegisters } from "@/app/features/registers/api/use-get-plate-registers";
import { DrawerBasis } from "./drawer-basis";
import { useDrawerPlate } from "@/hooks/use-drawer-plate";
import Image from "next/image";


export function DrawerPlate() {

    const handleDrawer = useDrawerPlate();
    const { data, isLoading } = useGetRegisters();

    return (
        <DrawerBasis
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <div className="flex flex-wrap flex-row w-5/6 m-auto">
               {JSON.stringify(data)}
            </div>
        </DrawerBasis>
    )
}