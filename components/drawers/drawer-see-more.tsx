import { useGetRegisters } from "@/app/features/registers/api/use-get-plate-registers";
import { DrawerBasis } from "./drawer-basis";

import { useDrawerSeeMore } from "@/hooks/use-drawer-see-more";
import { useGetRegister } from "@/app/features/registers/api/use-get-plate-register";
import { GridLoader } from "react-spinners";
import SeeMore from "../see-more";


export function DrawerSeeMore() {

    const handleDrawer = useDrawerSeeMore();

    return (
        <DrawerBasis
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <div className="h-[93vh] w-full">
                <SeeMore/>
            </div>
        </DrawerBasis>
    )
}