'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../Navbar/Navbar';
import { RiArrowLeftSLine } from "react-icons/ri";
export default function ShoesDetails({ params }) {
    const [shoe, setShoe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const id = params?.id;

    useEffect(() => {
        fetchShoeDetails();
    }, [id]);

    const fetchShoeDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const [shoesResponse, fitShoesResponse] = await Promise.all([
                fetch('/data/data.json'),
                fetch('/data/fitShoes.json')
            ]);
            const shoesData = await shoesResponse.json();
            const fitShoesData = await fitShoesResponse.json();
            const allShoes = [...shoesData, ...fitShoesData];
            const foundShoe = allShoes.find(s => s.id.toString() === id.toString());

            if (foundShoe) {
                setShoe(foundShoe);
            }
        } catch (error) {
            console.error('Error fetching shoe details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            </>
        );
    }

    if (!shoe) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-red-500">Shoe not found</p>
                </div>
            </>
        );
    }

    // Create demo images array (you should replace these with actual shoe images)
    const demoImages = shoe ? [
        shoe.image,
        shoe.image,
        shoe.image,
        shoe.image
    ] : [];

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <Link href="/shoes" className="text-green-600 flex hover:text-green-800 mb-6 items-center">
                    <RiArrowLeftSLine className='text-2xl' /> Back to Shoes
                </Link>

                <div className="grid md:grid-cols-2 gap-8 mt-6">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            {demoImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`bg-[#e8e8e8] rounded-lg p-2 transition-all w-20 ${selectedImage === index ? 'ring-2 ring-green-500' : ''
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        width={100}
                                        height={100}
                                        alt={`${shoe.name} view ${index + 1}`}
                                        className="w-full h-auto object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 bg-[#e8e8e8] rounded-lg p-4">
                            <Image
                                src={demoImages[selectedImage]}
                                width={600}
                                height={600}
                                alt={shoe.name}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-pathway-extreme font-bold">{shoe.name}</h1>
                        <p className="text-xl font-semibold">{(shoe.price / 100).toFixed(2)}€</p>
                        <p className="text-gray-600">{shoe.description}</p>

                        <div className="flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
                                {shoe.discount}% FIT
                            </span>
                            {shoe.Farbe && (
                                <span className="text-sm text-gray-600">
                                    {shoe.Farbe} Farbe
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
