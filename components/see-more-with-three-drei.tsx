'use client';

import * as THREE from 'three';
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'
import { easing } from 'maath';
import { useGetRegister } from '@/app/features/registers/api/use-get-plate-register';
import { GridLoader } from 'react-spinners';
import { useDrawerSeeMore } from '@/hooks/use-drawer-see-more';


const SeeMoreWithThreeDrei = () => {

    const handleDrawerSeeMore = useDrawerSeeMore();
    const { data, isLoading } = useGetRegister({ id: handleDrawerSeeMore.id as any });

    const material = new THREE.LineBasicMaterial({ color: 'white' })
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)])
    const state = proxy({
        clicked: null,
        urls: data?.photos.length ? data?.photos.map((u: any) => u) : [404].map((u) => `/${u}.jpeg`)
    })

    console.log(data?.photos)

    function Minimap() {
        const ref = useRef()
        const scroll = useScroll()
        const { urls } = useSnapshot(state)
        const { height } = useThree((state) => state.viewport)
        useFrame((state, delta) => {
            //@ts-ignore
            ref.current.children.forEach((child, index) => {
                // Give me a value between 0 and 1
                //   starting at the position of my item
                //   ranging across 4 / total length
                //   make it a sine, so the value goes from 0 to 1 to 0.
                const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
                easing.damp(child.scale, 'y', 0.15 + y / 6, 0.15, delta)
            })
        })
        return (
            //@ts-ignore
            <group ref={ref}>
                {urls.map((_: any, i: any) => (
                    //@ts-ignore
                    <line key={i} geometry={geometry} material={material} position={[i * 0.06 - urls.length * 0.03, -height / 2 + 0.6, 0]} />
                ))}
            </group>
        )
    };

    function Items({ w = 0.7, gap = 0.15 }) {
        const { urls } = useSnapshot(state)
        const { width } = useThree((state) => state.viewport)
        const xW = w + gap

        //@ts-ignore
        function Item({ index, position, scale, c = new THREE.Color(), ...props }) {
            const ref = useRef()
            const scroll = useScroll()
            const { clicked, urls } = useSnapshot(state)
            const [hovered, hover] = useState(false)
            const click = () => (state.clicked = index === clicked ? null : index)
            const over = () => hover(true)
            const out = () => hover(false)
            useFrame((state, delta) => {
                const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
                //@ts-ignore
                easing.damp3(ref.current.scale, [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 0.6 + y, 3], 0.15, delta)
                //@ts-ignore
                ref.current.material.scale[0] = ref.current.scale.x
                //@ts-ignore
                ref.current.material.scale[1] = ref.current.scale.y
                //@ts-ignore
                if (clicked !== null && index < clicked) easing.damp(ref.current.position, 'x', position[0] - 2, 0.15, delta)
                //@ts-ignore
                if (clicked !== null && index > clicked) easing.damp(ref.current.position, 'x', position[0] + 2, 0.15, delta)
                //@ts-ignore
                if (clicked === null || clicked === index) easing.damp(ref.current.position, 'x', position[0], 0.15, delta)
                //@ts-ignore
                easing.damp(ref.current.material, 'grayscale', hovered || clicked === index ? 0 : Math.max(0, 1 - y), 0.15, delta)
                //@ts-ignore
                easing.dampC(ref.current.material.color, hovered || clicked === index ? 'white' : '#aaa', hovered ? 0.3 : 0.15, delta)
            })
            //@ts-ignore
            return <Image ref={ref} {...props} position={position} scale={0.1} onClick={click} onPointerOver={over} onPointerOut={out} />
        }

        return (
            <ScrollControls horizontal damping={0.1} pages={(width - xW + urls.length * xW) / width}>
                <Minimap />
                <Scroll>
                    {urls.map((url: any, i: any) => <Item key={i} index={i} position={[i * xW, 0, 0]} scale={[w, 4, 9]} url={url} />) /* prettier-ignore */}
                </Scroll>
            </ScrollControls>
        )
    }

    if (!data) {
        return (
            <>
                <div className="flex justify-center p-10">
                </div>
                <div className="flex h-5/6 justify-center items-center">
                    <GridLoader color="#9e0837" size={100} />
                </div>
            </>
        )
    }

    return (
        <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} onPointerMissed={() => (state.clicked = null)}>
            <Items />
        </Canvas>
    )
};

export default SeeMoreWithThreeDrei;
