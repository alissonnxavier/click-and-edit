import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { useCreateRegisterPlate } from '@/app/features/registers/api/use-create-plate-register';
import { toast } from 'sonner';
import { useGenerateUploadUrl } from '@/app/features/upload/api/use-generate-upload-url';
import Image from 'next/image';
import UserButton from '@/app/features/auth/components/user-button';
import { FadeLoader, RiseLoader } from 'react-spinners';
import { LoaderIcon } from 'lucide-react';


const FormTest = () => {

    const { mutate: registerPlate, isPending } = useCreateRegisterPlate();
    const { mutate: generateUploadUrl, isPending: isUploading } = useGenerateUploadUrl();

    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [images, setImage] = useState<FileList | []>([]);
    const [imagesCount, setImageCount] = useState<number | null>();
    let imagesId = [] as any;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (images) {

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

                await imagesId.push(storageId);
            };
        }

        registerPlate({
            code: code,
            description: description,
            amount: amount,
            image: imagesId,
        }, {
            onSuccess: () => {
                toast.success("Register created");
                setImageCount(null);
            },
            onError: () => {
                toast.error("Register failed")
            }
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Input
                    type='number'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
                <Input
                    onChange={(e) => {
                        setImage(e.target.files as FileList);
                    }}
                    type='file'
                    accept='image/*'
                    multiple
                />
                {Array.from(images).map((image, index) => (
                    <Image
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt='alt'
                        width={50}
                        height={50}
                    />
                ))

                }
                <Button
                    type='submit'
                    disabled={isPending || isUploading}
                    className='w-40'
                >
                    {isPending || isUploading
                        ?
                        <div className='flex justify-center items-center'>
                            <LoaderIcon
                                className='size-5 mr-2 animate-spin'
                            />
                            uploading image {imagesCount}
                        </div>
                        : "Register"
                    }
                </Button>
            </form>
            <UserButton />
        </div>
    )
}

export default FormTest;