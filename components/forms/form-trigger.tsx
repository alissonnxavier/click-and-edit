'use client';


import { FormPlate } from "./form-plate";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import FormTest from "./form-test";


const FormTrigger = () => {
    return (
        <div className="flex items-center">
            <Tabs defaultValue="Plate" className="w-[410px]">
                <TabsList className="border grid w-full grid-cols-3 h-28 gap-">
                    <TabsTrigger className="border"  value="Plate">
                        Chapas
                    </TabsTrigger>
                </TabsList>
                <FormPlate tab="Plate" id="Plate" />
            </Tabs>
        </div>
    )
};

export default FormTrigger;