"use client"

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { Badge } from "./ui/badge";
import { Menu } from "./navigation-menu";
import { RiseLoader } from "react-spinners";
import { redirect, useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { Tip } from "./ui/tip";
import { useCurrentUser } from "@/app/features/auth/api/use-current-user";
import { useAuthActions } from "@convex-dev/auth/react";


export const Navbar = () => {
    const route = useRouter();
    const { setTheme } = useTheme();
    const [admin, setAdmin] = useState(false);
    const { signOut } = useAuthActions();

    const { data: userData, isLoading: isLoadingUser } = useCurrentUser();

    const AdminOrNot = async () => {

    }
    useEffect(() => {
        AdminOrNot();
    }, []);

    if(userData){
        
    }

    return (
        <div className="flex m-auto">
            <div className="flex">
                <div className="mr-6">
                    <Menu />
                </div>
                <Badge
                    variant='destructive'
                    className="mr-5 p-2 w-32"
                >
                    <div className="m-auto truncate">
                        {userData?.name ? `Inspetor ${userData.name}`
                            : <div><RiseLoader color="#f5f7fa" size={5} /></div>}
                    </div>
                </Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Alterar tema</span>
                        </Button>

                    </DropdownMenuTrigger>
                    {admin.valueOf() == true ?
                        <Tip
                            message="Criar novo usuário"
                            content={
                                <Button
                                    size='icon'
                                    className="bg-green-900 text-green-300 ml-1 hover:animate-pulse"
                                    onClick={() => { }}
                                >
                                    <UserPlus size={15} />
                                </Button>
                            }>
                        </Tip>
                        : <div className="w-10"></div>
                    }
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Claro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Escuro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            Sistema
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    size='icon'
                    onClick={() => signOut()}
                    className="ml-1"
                >
                    Sair
                </Button>
            </div>
        </div>
    )
}
