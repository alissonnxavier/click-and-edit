"use client"

import * as React from "react"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns";
import { useDrawerSeeMore } from "@/hooks/use-drawer-see-more"
import { useDrawerPlate } from "@/hooks/use-drawer-plate"
import { Id } from "@/convex/_generated/dataModel"
import { useEditForms } from "@/hooks/use-edit-form"
import { useRemoveRegisterPlate } from "@/app/features/registers/api/use-remove-plate-register"


type PlateTypes = {
    _id: string;
    supplier: string;
    lot: string;
    invoice: string;
    rir: string;
    hgOne: string;
    hbTwo: string;
    hbThree: string;
    inspector: string;
    image: any;
    _creationTime: string;
}

export const ColumnsPlate = () => {

    const { mutate, isPending } = useRemoveRegisterPlate();
    const handleDrawerSeeMore = useDrawerSeeMore();
    const handleEditForm = useEditForms();
    const handleDrawerPlate = useDrawerPlate();

    const columns: ColumnDef<PlateTypes>[] = [

        {
            accessorKey: "_creationTime",
            header: ({ column }) => {

                return (
                    <Button
                        variant="link"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Data
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className=""> {/* {row.getValue("_creationTime")}  */}{format(new Date(row.getValue('_creationTime')), "dd/MM/yyyy HH:mm:ss")} </div>,
        },
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("code")}</div>
            ),
        },
        {
            accessorKey: "supplier",
            header: "Fornecedor",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("supplier")}</div>
            ),
        },
        {
            accessorKey: "lot",
            header: "Lote",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("lot")}</div>
            ),
        },
        {
            accessorKey: "invoice",
            header: "Nota fiscal",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("invoice")}</div>
            ),
        },
        {
            accessorKey: "rir",
            header: "RIR",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("rir")}</div>
            ),
        },
        {
            accessorKey: "hardnessOne",
            header: "HB 1",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("hardnessOne")}</div>
            ),
        },
        {
            accessorKey: "hardnessTwo",
            header: "HB 2",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("hardnessTwo")}</div>
            ),
        },
        {
            accessorKey: "hardnessThree",
            header: "HB 3",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("hardnessThree")}</div>
            ),
        },
        {
            accessorKey: "image",
            header: "Imagens",
            cell: ({ row }) => (

                <div className="capitalize">{row.original.image.length}</div>
            ),
        },
        {
            accessorKey: "qualityMember",
            header: "Qualidade",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("qualityMember")}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                function HandleDelete(id: string, imagesName: []) {
                    location.reload();
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Açoẽs</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    handleDrawerSeeMore.onOpen(row.original._id as Id<"plateRegister">)

                                }}
                            >
                                Ver mais
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    handleEditForm.onOpen(row.original._id as Id<"plateRegister">, "Plate")
                                    handleDrawerPlate.onClose();
                                }}
                            >
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button
                                    variant='deleteButton'
                                    className="flex items-center gap-x-2"
                                    onClick={() => mutate({ id: row.original._id as Id<"plateRegister"> })}
                                >
                                    <Trash2 className="size-4" /> Excluir
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
    return columns;
}


