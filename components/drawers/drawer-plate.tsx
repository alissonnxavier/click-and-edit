import { useGetRegisters } from "@/app/features/registers/api/use-get-plate-registers";
import { DrawerBasis } from "./drawer-basis";
import { useDrawerPlate } from "@/hooks/use-drawer-plate";
import { DataTableNew } from "../dataTable/data-table-new";
import { ColumnsPlate } from "../columnsTable/plate-columns";
import { format } from "date-fns";
import { Button } from "../ui/button";
import ExportToExcel from '@/components/export-to-excell';

export function DrawerPlate() {

    const handleDrawer = useDrawerPlate();
    const { data, isLoading } = useGetRegisters();
    let editedData = [] as any;

    if (data) {

        data.forEach((element: any, index: any) => {
            editedData.push(
                [
                    format(new Date(element['_creationTime']), "dd/MM/yyyy HH:mm"),
                    element['code'],
                    element['supplier'],
                    element['lot'],
                    element['invoice'],
                    element['rir'],
                    element['hardnessOne'],
                    element['hardnessTwo'],
                    element['hardnessThree'],
                    //@ts-ignore
                    element?.image?.length,
                    element['qualityMember'],
                ]
            )
        });
        editedData.push(
            [
                'Data',
                'Item',
                'Fornecedor',
                'Lote',
                'Nota Fiscal',
                'RIR',
                'HB 1',
                'HB 2',
                'HB 3',
                'Imagens',
                'Qualidade',
            ]
        );
        editedData.reverse();
    }

    return (
        <DrawerBasis
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <div>
                {data?.length > 0 &&
                    <div className="flex justify-center items-center">
                        <Button className="p-10 shadow-xl hover:shadow-sm">
                            <div>
                                <ExportToExcel apiData={editedData} fileName='planilha inspeção de chapas' />
                            </div>
                        </Button>
                    </div>
                }
                <div className="w-screen ">
                    <DataTableNew
                        tableName="Inspeção de chapas"
                        searchKey="code"
                        columns={ColumnsPlate()}
                        data={data}
                    />
                </div>
            </div>
        </DrawerBasis>
    )
}