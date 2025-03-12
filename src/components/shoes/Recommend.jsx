import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function RecommendShoes() {
    const [shoes, setShoes] = useState([]);

    useEffect(() => {
        fetchAllShoes();
    }, []);

    const fetchAllShoes = async () => {
        try {
            const response = await fetch('/data/recommendShoes.json');
            const data = await response.json();
            
            // Ensure all shoes have valid data
            const validShoes = data.filter(shoe => 
                shoe.id && 
                shoe.name && 
                shoe.image && 
                shoe.price && 
                shoe.description
            );
            
            setShoes(validShoes);
        } catch (error) {
            console.error('Error fetching recommended shoes:', error);
            setShoes([]);
        }
    };

    if (shoes.length === 0) {
        return null;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Recommended Shoes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {shoes.map((shoe) => (
                    <Link href={`/shoes/details/${shoe.id}`} key={shoe.id}>
                        <div className="bg-white rounded-lg shadow-md transform transition-all duration-300 hover:shadow-xl cursor-pointer">
                            <div className="aspect-square bg-[#e8e8e8] relative mb-4 flex items-center justify-center rounded-t-lg overflow-hidden">
                                <Image
                                    src={shoe.image}
                                    width={500}
                                    height={400}
                                    alt={shoe.name}
                                    className="w-[400px] h-[400px] md:w-[240px] md:h-[240px] object-contain transition-transform duration-300 hover:scale-105"
                                    priority
                                />
                            </div>
                            <div className="space-y-2 px-4 pb-3 overflow-hidden">
                                <h3 className="font-pathway-extreme font-semibold">{shoe.name}</h3>
                                <p className="text-gray-600">{shoe.description}</p>
                                <p className="font-semibold">{(shoe.price / 100).toFixed(2)}€</p>
                                {shoe.discount && (
                                    <div className="flex items-center space-x-2">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {shoe.discount}% FIT
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
