import { useGetRegisters } from "@/app/features/registers/api/use-get-plate-registers";
import { DrawerBasis } from "./drawer-basis";
import { useDrawerPlate } from "@/hooks/use-drawer-plate";
import Image from "next/image";


export function DrawerPlate() {

    const handleDrawer = useDrawerPlate();
    const { data, isLoading } = useGetRegisters();

    if (data?.photos === undefined) return null;

    return (
        <DrawerBasis
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <div className="flex flex-wrap flex-row w-5/6 m-auto">
                {data && data[0]?.photos.map((img: string, index: string)=>(
                    <Image
                        key={index}
                        alt="alt"
                        src={img}
                        width={30}
                        height={30}
                    />
                ))}
            </div>
        </DrawerBasis>
    )
}