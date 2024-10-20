import Image from 'next/image';
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
import {
    TabsContent,
} from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { useCallback, useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';
import { ImagePlus } from 'lucide-react';
import { Tip } from '@/components/ui/tip';
import { useCreateRegisterPlate } from '@/app/features/registers/api/use-create-plate-register';
import { useGenerateUploadUrl } from '@/app/features/upload/api/use-generate-upload-url';
import { toast as toastHot } from 'react-hot-toast';
import { LoaderIcon } from 'lucide-react';
import { useCurrentUser } from '@/app/features/auth/api/use-current-user';
import { useGetRegister } from '@/app/features/registers/api/use-get-plate-register';
import { useEditForms } from '@/hooks/use-edit-form';
import { useUpdateRegisterPlate } from '@/app/features/registers/api/use-update-plate-register';
import { Id } from '@/convex/_generated/dataModel';


const formSchema = z.object({
    id: z.string().default(''),
    item: z.string().min(4),
    supplier: z.string().min(2),
    lot: z.string().min(2),
    invoice: z.string().min(1),
    rir: z.string().min(1),
    hardnessOne: z.string().min(1),
    hardnessTwo: z.string().min(1),
    hardnessThree: z.string().min(1),
    images: z.any(z.any()),
    imagesOldName: z.any().default([]),
    originalInspector: z.any(),
});

type SteelPlateFormValues = z.infer<typeof formSchema>;

interface FormPlateProps {
    tab: string;
    id: string;
}

export const FormPlate: React.FC<FormPlateProps> = ({ tab, id }) => {

    const handleEditForm = useEditForms();

    const { data: dataPlateRegister, isLoading: isLoadingPlateRegister } = useGetRegister({ id: handleEditForm.id });
    const { mutate: registerPlate, isPending: isRegisterPending } = useCreateRegisterPlate();
    const { mutate: updateRegisterPlate, isPending: isUpdatingRegisterPlate } = useUpdateRegisterPlate();
    const { mutate: generateUploadUrl, isPending: isUploading } = useGenerateUploadUrl();
    const { data: userData, isLoading: isLoadingCurrentUser } = useCurrentUser();

    const form = useForm<SteelPlateFormValues>({
        resolver: zodResolver(formSchema),
    });

    const [inspectionData, setInspectionData] = useState([] as any);
    const [inspetorName, setInspectorName] = useState('');
    const [base64, setBase64] = useState([]);
    const [compressedImages, setCompressedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<any | []>([]);
    const [imageCount, setImageCount] = useState<any>("");
    let imagesId = [] as any;
    let currentCode = [];
    let a = [] as any;

    if (handleEditForm.id === undefined) {
        a = [...images];
    };

    if (dataPlateRegister?.photos?.length > 0) {
        a = [...images, ...dataPlateRegister?.photos && dataPlateRegister?.photos];
        let fields = [
            'supplier',
            'lot',
            'invoice',
            'rir',
            'hardnessOne',
            'hardnessTwo',
            'hardnessThree'
        ];
        if (form.getValues('hardnessThree') === undefined) {
            form.setValue("item", dataPlateRegister[0]?.code?.slice(3, dataPlateRegister[0]?.code?.length));
        }
        if (form.getValues('hardnessThree') === undefined) {
            for (const field of fields) {
                form.setValue(field as any, dataPlateRegister[0]?.[field]);
            };
        }
    };

    const handleDrop = useCallback(async (files: any) => {
        if (images.length >= 1) {
            let array = [...images];
            array.push(...files);
            setImages(array);
        } else {
            setImages(files)
        }
    }, [images]);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        disabled: isLoading,
        accept: {
            'image/jpeg': [],
            'image/jpg': [],
            'image/png': [],
        },
    });

    const handleImages = (index: number) => {
        let arr = [];
        arr = [...images];
        arr.splice(index, 1);
        setImages(arr);
    };

    useEffect(() => {
        setInspectorName(userData?.name as string)
    }, [setInspectorName, userData?.name]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let fields = [
            'item',
            'supplier',
            'lot',
            'invoice',
            'rir',
            'hardnessOne',
            'hardnessTwo',
            'hardnessThree'
        ];

        for (const field of fields) {
            if (!form.getValues(field as any)) {
                form.setError(field as any, { type: "minLength", message: "field required" });
                toastHot.error('All fields are required.', {
                    style: {
                        border: '5px solid #fff',
                        padding: '16px',
                        color: 'white',
                        background: 'red'
                    },
                    iconTheme: {
                        primary: 'white',
                        secondary: 'red',
                    },
                });
                return;
            };
        };

        try {
            setIsLoading(true);
            if (images.length > 0) {
                for (let i = 0; images.length > i; i++) {

                    const url = await generateUploadUrl({}, { throwError: true });

                    if (!url) {
                        throw new Error("URL not found!")
                    }

                    const result = await fetch(url, {
                        method: "POST",
                        headers: { "Content-type": images[i]!.type },
                        body: images[i],
                    });

                    const { storageId } = await result.json();

                    setImageCount(i + 1);

                    imagesId.push(storageId);
                };
            }

            registerPlate({
                code: `CH.${form.getValues('item')}`,
                //@ts-ignore
                supplier: form.getValues('supplier'),
                lot: form.getValues('lot'),
                invoice: form.getValues('invoice'),
                rir: form.getValues('rir'),
                hardnessOne: form.getValues('hardnessOne'),
                hardnessTwo: form.getValues('hardnessTwo'),
                hardnessThree: form.getValues('hardnessThree'),
                qualityMember: userData?.name,
                image: imagesId as any,
            }, {
                onSuccess: () => {
                    toastHot.success('Register created!', {
                        style: {
                            border: '5px solid #fff',
                            padding: '16px',
                            color: 'white',
                            background: 'green'
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: 'green',
                        },
                    });
                    form.clearErrors();
                    setIsLoading(false);
                    setImageCount("");
                    form.reset({
                        item: '',
                        supplier: 'Fornecedor',
                        lot: '',
                        invoice: '',
                        rir: '',
                        hardnessOne: '',
                        hardnessTwo: '',
                        hardnessThree: '',
                    });
                    setImages([])
                },
                onError: () => {
                    toastHot.error('Register failed!', {
                        style: {
                            border: '5px solid #fff',
                            padding: '16px',
                            color: 'white',
                            background: 'red'
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: 'red',
                        },
                    });
                }
            });
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            form.reset({
                item: '',
                supplier: 'Fornecedor',
                lot: '',
                invoice: '',
                rir: '',
                hardnessOne: '',
                hardnessTwo: '',
                hardnessThree: '',
            });
            setImages([]);
        }
    };


    const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let fields = [
            'item',
            'supplier',
            'lot',
            'invoice',
            'rir',
            'hardnessOne',
            'hardnessTwo',
            'hardnessThree'
        ];

        for (const field of fields) {
            if (!form.getValues(field as any)) {
                form.setError(field as any, { type: "minLength", message: "field required" });
                toastHot.error('All fields are required.', {
                    style: {
                        border: '5px solid #fff',
                        padding: '16px',
                        color: 'white',
                        background: 'red'
                    },
                    iconTheme: {
                        primary: 'white',
                        secondary: 'red',
                    },
                });
                return;
            };
        };

        try {
            setIsLoading(true);
            if (a.length > 0) {
                for (let i = 0; a.length > i; i++) {

                    if (typeof (a[i]) !== "string") {



                        const url = await generateUploadUrl({}, { throwError: true });

                        if (!url) {
                            throw new Error("URL not found!")
                        }

                        const result = await fetch(url, {
                            method: "POST",
                            headers: { "Content-type": a[i]!.type },
                            body: a[i],
                        });

                        const { storageId } = await result.json();

                        setImageCount(i + 1);

                        currentCode.push(storageId);
                    };
                };
                imagesId.push(...currentCode, ...dataPlateRegister[0]?.image);
            }

            updateRegisterPlate({
                //@ts-ignore
                id: dataPlateRegister[0]?._id as Id<"plateRegister">,
                code: `CH.${form.getValues('item')}`,
                supplier: form.getValues('supplier'),
                lot: form.getValues('lot'),
                invoice: form.getValues('invoice'),
                rir: form.getValues('rir'),
                hardnessOne: form.getValues('hardnessOne'),
                hardnessTwo: form.getValues('hardnessTwo'),
                hardnessThree: form.getValues('hardnessThree'),
                qualityMember: userData?.name,
                image: imagesId as any,
            }, {
                onSuccess: () => {
                    toastHot.success('Register updated!', {
                        style: {
                            border: '5px solid #fff',
                            padding: '16px',
                            color: 'white',
                            background: '#f0b70c'
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: '#f0b70c',
                        },
                    });
                    form.clearErrors();
                    setIsLoading(false);
                    setImageCount("");
                    form.reset({
                        item: '',
                        supplier: 'Fornecedor',
                        lot: '',
                        invoice: '',
                        rir: '',
                        hardnessOne: '',
                        hardnessTwo: '',
                        hardnessThree: undefined,
                    });
                    setImages([]);
                    a = [];
                    handleEditForm.onClose();

                },
                onError: () => {
                    toastHot.error('Register failed to update!', {
                        style: {
                            border: '5px solid #fff',
                            padding: '16px',
                            color: 'white',
                            background: 'red'
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: 'red',
                        },
                    });
                }
            });
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            form.reset({
                item: '',
                supplier: 'Fornecedor',
                lot: '',
                invoice: '',
                rir: '',
                hardnessOne: '',
                hardnessTwo: '',
                hardnessThree: '',
            });
            setImages([]);
            a = [];
            handleEditForm.onClose
        }
    };

    console.log("imagesID", imagesId);

    return (
        <>
            <Form {...form}>
                <form onSubmit={handleEditForm.id === undefined ? onSubmit : onUpdate}>
                    <TabsContent value={tab}>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle>
                                        <Badge className="p-1 text-2xl truncate">
                                            Chapas
                                        </Badge>
                                    </CardTitle>
                                    <div>
                                        <CardDescription>
                                            Formulário digital Rev: 00
                                        </CardDescription>
                                        <CardDescription>
                                            Criação: 00/00/00
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="pt-2">
                                    <div className="space-y-1 mb-4 ">
                                        <div className="">
                                            <div className='flex mb-3'>
                                                <div className='pt-10 mr-1'>

                                                    CH.
                                                </div>
                                                <div className='flex gap-x-2'>
                                                    <FormField
                                                        control={form.control}
                                                        name='item'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Item:</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type='number' placeholder='Codigo do item' {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name='supplier'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Fornecedor:</FormLabel>
                                                                <FormControl>
                                                                    <Select
                                                                        onValueChange={field.onChange}
                                                                        value={field.value}
                                                                        defaultValue={field.value}
                                                                    >
                                                                        <SelectTrigger className="w-[150px]">
                                                                            <SelectValue placeholder="Fornecedor" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectItem value="Shandoing">Shandoing</SelectItem>
                                                                                <SelectItem value="Usiminas">Usiminas</SelectItem>
                                                                                <SelectItem value="Panatlantica">Panatlantica</SelectItem>
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex gap-2'>
                                                <FormField
                                                    control={form.control}
                                                    name='lot'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Lote:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='text' placeholder='_,_,_,_,_,_' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='invoice'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nota fiscal:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number' placeholder='_,_,_,_,_,_' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='rir'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>RIR:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number' placeholder='_,_,_,_,_,_' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className='flex gap-2'>
                                                <FormField
                                                    control={form.control}
                                                    name='hardnessOne'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='flex justify-center pt-[10px]'><Badge variant='destructive'>HB:</Badge></FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    className='text-center '
                                                                    type='number'
                                                                    placeholder='_,_'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='hardnessTwo'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='flex justify-center pt-[10px]'><Badge variant='destructive'>HB:</Badge></FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    className='text-center '
                                                                    type='number'
                                                                    placeholder='_,_'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='hardnessThree'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='flex justify-center pt-[10px]'><Badge variant='destructive'>HB:</Badge></FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    className='text-center '
                                                                    type='number'
                                                                    placeholder='_,_'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='pt-'>
                                    <section
                                        className="
                                            flex
                                            justify-around
                                            border-dashed 
                                            border-2 
                                            p-3
                                            border-red-500
                                            rounded-lg
                                            shadow-lg shadow-red-900/50
                                            hover:shadow-md hover:shadow-red-300/50
                                        ">
                                        <div {...getRootProps({ className: 'dropzone' })}>
                                            <input {...getInputProps()} />
                                            <div className='flex justify-center align-middle items-center'>
                                                <Tip
                                                    message='Carregar imagens'
                                                    content={
                                                        <ImagePlus size={46} className='animate-pulse' />
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <aside>
                                            <ul className='flex justify-center align-middle items-center'>
                                                {a &&
                                                    //@ts-ignore
                                                    a.map((img: File, index: number) => (
                                                        <>
                                                            <div >
                                                                <Image
                                                                    className='m-1 aspect-square object-cover rounded hover:scale-150 transition'
                                                                    key={index}
                                                                    src={typeof (img) === "string" ? img as any : URL.createObjectURL(img)}
                                                                    height={38}
                                                                    width={38}
                                                                    alt='uploaded image'
                                                                    onClick={() => {
                                                                        handleImages(index)
                                                                    }}
                                                                />
                                                            </div>
                                                        </>
                                                    ))
                                                }
                                            </ul>
                                        </aside>
                                    </section>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className='flex w-[390px] justify-center '>

                                    {handleEditForm.id === undefined
                                        ?
                                        <Button
                                            disabled={isRegisterPending || isUploading || isLoading}
                                            type='submit'
                                            className='flex w-[320px] '

                                        >
                                            {isLoading
                                                ? <div className='gap-x-2 flex justify-center items-center'><LoaderIcon className='size-5 animate-spin' />uploading image {imageCount}</div>
                                                : 'Registrar'
                                            }
                                        </Button>
                                        :
                                        <div className='flex w-full justify-around items-center'>
                                            <Button
                                                variant='outline'
                                                onClick={() => {
                                                    handleEditForm.onClose
                                                    window.location.reload()
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                disabled={isRegisterPending || isUploading || isLoading || isUpdatingRegisterPlate}
                                                type='submit'
                                                className='bg-yellow-600 border'
                                            >
                                                {isLoading
                                                    ? <div className='gap-x-2 flex justify-center items-center'><LoaderIcon className='size-5 animate-spin' />uploading image {imageCount}</div>
                                                    : 'salvar alteração'
                                                }
                                            </Button>
                                        </div>
                                    }

                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </form>
            </Form >
        </>
    )
};
