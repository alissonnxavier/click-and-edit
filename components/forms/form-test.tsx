import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { useCreateRegisterPlate } from '@/app/features/registers/api/use-create-plate-register';
import { toast } from 'sonner';
import { useGenerateUploadUrl } from '@/app/features/upload/api/use-generate-upload-url';
import { Id } from '@/convex/_generated/dataModel';
import Image from 'next/image';


const FormTest = () => {

    const { mutate: registerPlate, isPending } = useCreateRegisterPlate();
    const { mutate: generateUploadUrl } = useGenerateUploadUrl();

    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [image, setImage] = useState<File | null>(null);

    let imageValue = "";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const url = await generateUploadUrl({}, { throwError: true });

        if (image) {

            if (!url) {
                throw new Error("URL not found!")
            }

            const result = await fetch(url, {
                method: "POST",
                headers: { "Content-type": image.type },
                body: image,
            });

            const { storageId } = await result.json();

            imageValue = storageId;
        };

        registerPlate({
            code: code,
            description: description,
            amount: amount,
            image: imageValue as Id<"_storage"> | undefined,
        }, {
            onSuccess: () => {
                toast.success("Register created")
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
                    onChange={(e) => setImage(e.target.files![0])}
                    type='file'
                    accept='image/*'
                />
                {!!image && (<Image
                    src={URL.createObjectURL(image)}
                    alt='alt'
                    width={50}
                    height={50}
                />
                )}
                <Button
                    type='submit'
                    disabled={isPending}
                >
                    Register
                </Button>
            </form>
        </div>
    )
}

export default FormTest;