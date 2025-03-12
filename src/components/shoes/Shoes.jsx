'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function Shoes() {
    const [shoes, setShoes] = useState([]);
    const [fitShoes, setFitShoes] = useState([]);

    useEffect(() => {
        fetchAllShoes();
    }, []);
    const fetchAllShoes = async () => {
        try {
            const [shoesResponse, fitShoesResponse] = await Promise.all([
                fetch('/data/data.json'),
                fetch('/data/fitShoes.json')
            ]);

            const shoesData = await shoesResponse.json();
            const fitShoesData = await fitShoesResponse.json();

            setShoes(shoesData);
            setFitShoes(fitShoesData);
        } catch (error) {
            console.error('Error fetching shoes:', error);
        }
    };

    return (
        <>
            <div className="mb-8 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fitShoes.map((shoe) => (
                        <Link href={`/shoes/details/${shoe.id}`} key={shoe.id}>
                            <div className="relative transform transition-all duration-300  hover:shadow-xl cursor-pointer">
                                <div className="relative">
                                    {/* Black label at the top */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="bg-black text-green-400 text-sm px-4 py-1 rounded-full">
                                            Your Best Matching Shoe!
                                        </span>
                                    </div>

                                    {/* Image section with hover effect */}
                                    <div className="bg-[#e8e8e8] rounded-t-lg relative overflow-hidden">
                                        <Image
                                            src={shoe.image}
                                            width={500}
                                            height={400}
                                            alt={shoe.name}
                                            className="w-full h-full px-1 md:px-0 md:w-[324px] md:h-[324px] mx-auto transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>

                                    {/* Black info section */}
                                    <div className="bg-black rounded-b-lg text-green-400 p-4 space-y-2 overflow-hidden">
                                        <h3 className="font-pathway-extreme font-semibold text-lg">{shoe.name}</h3>
                                        <p className="opacity-80">{shoe.description}</p>
                                        <p className="text-lg">{(shoe.price / 100).toFixed(2)}€</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm">{shoe.Farbe} Farbe</p>
                                            <span className="bg-green-400 text-black text-xs font-medium px-2.5 py-0.5 rounded">
                                                {shoe.discount}% FIT
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Regular shoes grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shoes.map((shoe) => (
                    <Link href={`/shoes/details/${shoe.id}`} key={shoe.id}>
                        <div className="bg-white rounded-lg shadow-md transform transition-all duration-300  hover:shadow-xl cursor-pointer">
                            <div className="aspect-square bg-[#e8e8e8] relative mb-4 flex items-center justify-center rounded-t-lg overflow-hidden">
                                <Image
                                    src={shoe.image}
                                    width={500}
                                    height={400}
                                    alt={shoe.name}
                                    className="w-[400px] h-[400px] md:w-[240px] md:h-[240px] object-contain transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="space-y-2 px-4 pb-3 overflow-hidden">
                                <h3 className="font-pathway-extreme font-semibold">{shoe.name}</h3>
                                <p className="text-gray-600">{shoe.description}</p>
                                <p className="font-semibold">{(shoe.price / 100).toFixed(2)}€</p>
                                <div className="flex items-center space-x-2">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {shoe.discount}% FIT
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}
