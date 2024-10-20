import { useGetRegister } from '@/app/features/registers/api/use-get-plate-register';
import { useDrawerSeeMore } from '@/hooks/use-drawer-see-more';
import React, { useState } from 'react';
import Image from 'next/image';
import InfoCard from './info-card';
import { ScrollArea } from './ui/scroll-area';

const SeeMore = () => {

    const handleDrawerSeeMore = useDrawerSeeMore();
    const { data, isLoading } = useGetRegister({ id: handleDrawerSeeMore.id });
    const [imageIndex, setImageIndex] = useState(0);
    const [imageOnPreview, setImageOnPreview] = useState(data?.photos);

    if (!data) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <ScrollArea>
            <div className='flex flex-wrap justify-center items-center h-screen w-full snap-y gap-2'>
                <div className='flex justify-start sm:flex-row sm:flex-wrap xl:flex-col md:flex-col md:h-full md:justify-start xl:h-full'>
                    {data?.photos.map((photo: any, index: any) => (
                        <div
                            className='h-20 flex justify-center'
                            key={index}>
                            <Image
                                alt='ainImage'
                                width={70}
                                height={70}
                                src={photo}
                                sizes="(min-width: 808px) 50vw, 100vw"
                                priority
                                className='rounded-sm m-2 hover:scale-125 transition object-cover'
                                onClick={() => { setImageIndex(index) }}
                            />
                        </div>
                    ))}
                </div>
                <div className='flex flex-col  justify-start  xl:h-full  mt-3 h-80 md:h-full'>
                    <Image
                        alt='ainImage'
                        width={400}
                        height={350}
                        src={!imageOnPreview ? data?.photos[imageIndex] : imageOnPreview}
                        priority
                        className='rounded-sm object-contain'
                        quality={100}
                    />
                </div>
                <div className='h-full mt-56 xl:mt-0 md:mt-0'>
                    <div className=''>
                        <InfoCard
                            data={data}
                        />
                    </div>
                </div>
            </div>
        </ScrollArea>
    )
}

export default SeeMore