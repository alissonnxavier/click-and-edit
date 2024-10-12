import { useGetRegister } from '@/app/features/registers/api/use-get-plate-register';
import { useDrawerSeeMore } from '@/hooks/use-drawer-see-more';
import React, { useState } from 'react';
import Image from 'next/image';
import InfoCard from './info-card';
import { ScrollArea } from './ui/scroll-area';

const SeeMore = () => {

    const handleDrawerSeeMore = useDrawerSeeMore();
    const { data, isLoading } = useGetRegister({ id: handleDrawerSeeMore.id });
    const [imageOnPreview, setImageOnPreview] = useState(data?.photos[0]);

    if (!data) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <ScrollArea>
            <div className='flex  md:flex-wrap  justify-center items-center h-screen w-full snap-y'>
                <div className='flex flex-col justify-start h-full '>
                    {data?.photos.map((photo: any, index: any) => (
                        <Image
                            key={index}
                            alt='ainImage'
                            width={100}
                            height={100}
                            src={photo}
                            priority
                            className='rounded-sm m-2 border '
                            onClick={() => { setImageOnPreview(photo) }}
                        />
                    ))}
                </div>
                <div className='h-full mt-3'>
                    <Image
                        alt='ainImage'
                        width={490}
                        height={500}
                        src={!imageOnPreview ? data?.photos[0] : imageOnPreview}
                        priority
                        className='rounded-sm'
                        quality={100}
                    />
                </div>
                <div className='h-full m-2 mt-5 md:mt-0 md:ml-0'>
                    <InfoCard
                        data={data}
                    />
                </div>
            </div>
        </ScrollArea>
    )
}

export default SeeMore