import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "./ui/badge"

interface InfoCardProps {
    data: any
};

export const InfoCard = ({ data = "" }: InfoCardProps) => {

    return (
        <Card className="w-[350px] border-none">
            <CardHeader>
                <CardTitle><Badge className="p-4 text-xl font-extrabold"> {data[0].code} </Badge></CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="gap-y-1">
                    <div className="flex items-center text-xl"><Badge variant='outline'> Data: </Badge> &nbsp; <div className="text-xs "> {data[0]._creationTime}</div></div>
                    <div className="flex items-center text-xl"><Badge variant='outline'> Nota fiscal: </Badge> &nbsp; <div className="text-xs "> {data[0].invoice}</div></div>
                    <div className="flex items-center text-xl"><Badge variant='outline'> Lote: </Badge> &nbsp; <div className="text-xs "> {data[0].lot}</div></div>
                    <div className="flex items-center text-xl"><Badge variant='outline'> RIR: </Badge> &nbsp; <div className="text-xs "> {data[0].rir}</div></div>
                    <div className="flex items-center text-xl"><Badge variant='outline'> Fornecedor: </Badge> &nbsp; <div className="text-xs "> {data[0].supplier}</div></div>
                    <div className="flex items-center text-xl"><Badge variant='outline'> Qualidade: </Badge> &nbsp; <div className="text-xs "> {data[0].qualityMember}</div></div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div>
                    <div className="text-muted-foreground text-xs">HB 1</div>
                    <Badge>{data[0].hardnessOne}</Badge>
                </div>
                <div>
                    <div className="text-muted-foreground text-xs">HB 2</div>
                    <Badge>{data[0].hardnessTwo}</Badge>
                </div>
                <div>
                    <div className="text-muted-foreground text-xs">HB 3</div>
                    <Badge>{data[0].hardnessThree}</Badge>
                </div>
            </CardFooter>
        </Card>
    )
};

export default InfoCard;
