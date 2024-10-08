"use client";


import { DrawerPlate } from "@/components/drawers/drawer-plate";
import { useEffect, useState } from "react";


export const DrawerPlateProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <div>
                <DrawerPlate/>
            </div>
        </>
    )
}