import { useGetRegisters } from "@/app/features/registers/api/use-get-plate-registers";
import { DrawerBasis } from "./drawer-basis";
import { useDrawerPlate } from "@/hooks/use-drawer-plate";
import { DataTableNew } from "../dataTable/data-table-new";
import { ColumnsPlate } from "../columnsTable/plate-columns";

export function DrawerPlate() {

    const handleDrawer = useDrawerPlate();
    const { data, isLoading } = useGetRegisters();

    return (
        <DrawerBasis
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <DataTableNew
                tableName="Inspeção de chapas"
                searchKey="code"
                columns={ColumnsPlate()}
                data={data}
            />
        </DrawerBasis>
    )
}