import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductCard({ shoe }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);

    const colorImages = shoe.colors?.[selectedColorIndex]?.images?.map(img => img.url) || [];

    const startImageCycle = () => {
        if (colorImages.length <= 1) return null;

        return setInterval(() => {
            setCurrentImageIndex(prev =>
                prev === colorImages.length - 1 ? 0 : prev + 1
            );
        }, 2000);
    };

    return (
        <Link href={`/shoes/details/${shoe.id}/${shoe.name.toLowerCase().replace(/\s+/g, '-')}`}>
            <div
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group"
                onMouseEnter={() => {
                    const interval = startImageCycle();
                    window._imageInterval = interval;
                }}
                onMouseLeave={() => {
                    if (window._imageInterval) {
                        clearInterval(window._imageInterval);
                        setCurrentImageIndex(0);
                    }
                }}
            >
                {/* Image Container */}
                <div className="aspect-square bg-[#f8f8f8] relative rounded-t-xl overflow-hidden">
                    <Image
                        src={colorImages[currentImageIndex] || ''}
                        width={300}
                        height={400}
                        alt={shoe.name}
                        className="object-contain p-2 w-full h-full transition-all duration-500"
                        priority
                    />
                    {/* Badges */}
                    {
                        shoe?.offer && (
                            <div className="absolute top-3 right-3 flex gap-2">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {shoe?.offer}% OFF
                                </span>
                            </div>
                        )
                    }
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Title and Price */}
                    <div className="space-y-1">
                        <div className='flex justify-between'>
                            <h3 className="font-semibold text-lg truncate">{shoe.name}</h3>
                            <p className="bg-gray-100 px-2 py-1 rounded-full text-xs ">
                                {shoe?.gender}
                            </p>
                        </div>
                        <p className="text-green-600 font-medium text-lg">
                            {Number(shoe.price).toFixed(2)}€
                        </p>
                    </div>

                    {/* Type and Category */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className='bg-gray-100 px-2 py-1 rounded-full text-xs font-medium capitalize'>{shoe.typeOfShoes}</span>
                        <span className='text-gray-400'>-</span>
                        <span className='bg-gray-100 px-2 py-1 rounded-full text-xs font-medium capitalize'>{shoe.Category}</span>
                    </div>

                    {/* Color Variants */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Farben:</span>
                        <div className="flex gap-1">
                            {shoe.colors?.map((variant, index) => (
                                <div
                                    key={index}
                                    className={`w-4 h-4 rounded-full border shadow-sm transition-transform hover:scale-110 cursor-pointer
                                        ${selectedColorIndex === index ? 'ring-2 ring-green-500' : ''}`}
                                    style={{ backgroundColor: variant.colorCode }}
                                    title={variant.colorName}
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent Link navigation
                                        setSelectedColorIndex(index);
                                        setCurrentImageIndex(0);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
} 