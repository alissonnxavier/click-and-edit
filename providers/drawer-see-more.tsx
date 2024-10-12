"use client";


import { DrawerSeeMore } from "@/components/drawers/drawer-see-more";
import { useEffect, useState } from "react";


export const DrawerSeeMoreProvider = () => {
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
                <DrawerSeeMore />
            </div>
        </>
    )
}