'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi';

export default function Shoes() {
    const [shoes, setShoes] = useState([]);
    const [fitShoes, setFitShoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

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

    // Filter shoes based on search term
    const filteredShoes = shoes.filter(shoe =>
        shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shoe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFitShoes = fitShoes.filter(shoe =>
        shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shoe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Search Bar */}
            <div className="pb-5">
                <div className="flex justify-end">
                    <div className="relative w-full max-w-md">
                        <div className={`flex items-center border border-gray-300 bg-white rounded-lg shadow-sm transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-[#62A07B]' : ''}`}>
                            <FiSearch className="ml-4 text-gray-500 text-xl" />
                            <input
                                type="text"
                                placeholder="Suchen Sie nach Schuhen..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full px-4 py-3 rounded-lg focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Show "No results found" message when both filtered arrays are empty */}
            {filteredFitShoes.length === 0 && filteredShoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <FiSearch className="text-6xl text-gray-400 mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">Keine Ergebnisse gefunden</h3>
                    <p className="text-gray-500">
                        Leider konnten wir keine Schuhe finden, die Ihrer Suche entsprechen.
                    </p>
                </div>
            ) : (
                <>
                    {/* Fit Shoes Section */}
                    {filteredFitShoes.length > 0 && (
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredFitShoes.map((shoe) => (
                                    <Link href={`/shoes/details/${shoe.id}`} key={shoe.id}>
                                        <div className="relative transform transition-all duration-300  hover:shadow-xl cursor-pointer">
                                            <div className="relative">
                                                {/* Black label at the top */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className="bg-black text-[#62A07C] text-sm px-4 py-1 rounded-full best-match-label">
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
                                                <div className="bg-black rounded-b-lg text-[#62A07C] p-4 space-y-2 overflow-hidden">
                                                    <h3 className="font-pathway-extreme font-semibold text-lg">{shoe.name}</h3>
                                                    <p className="opacity-80">{shoe.description}</p>
                                                    <p className="text-sm">{shoe.Farbe} Farbe</p>
                                                    <p className="text-lg">{(shoe.price / 100).toFixed(2)}€</p>
                                                    <div className="flex items-center space-x-2">

                                                        <span className="bg-[#62A07C] text-black text-xs font-medium px-2.5 py-0.5 rounded">
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
                    )}

                    {/* Regular Shoes Section */}
                    {filteredShoes.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredShoes.map((shoe) => (
                                <Link href={`/shoes/details/${shoe.id}`} key={shoe.id}>
                                    <div className="bg-white rounded-lg shadow-md transform transition-all duration-300  hover:shadow-xl cursor-pointer">
                                        <div className="aspect-square bg-[#e8e8e8] relative mb-4 flex items-center justify-center rounded-t-lg overflow-hidden">
                                            <Image
                                                src={shoe.image}
                                                width={1000}
                                                height={400}
                                                alt={shoe.name}
                                                className="w-[400px] h-[400px] md:w-[540px] md:h-[300px] object-contain transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                        <div className="space-y-1 px-4 pb-3 overflow-hidden">
                                            <h3 className="font-pathway-extreme font-bold">{shoe.name}</h3>
                                            <p className="text-gray-600">{shoe.description}</p>
                                            <p className="text-sm">{shoe.Farbe} Farbe</p>
                                            <p className="font-semibold">{(shoe.price / 100).toFixed(2)}€</p>
                                            <div className="flex items-center space-x-2">
                                                <span className="bg-[#62A07B] text-white text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {shoe.discount}% FIT
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    )
}
