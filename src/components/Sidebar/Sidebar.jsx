'use client'
import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { useSearchParams, useRouter } from 'next/navigation';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import * as Slider from "@radix-ui/react-slider";

export default function Sidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [openSections, setOpenSections] = useState({
        schuhtyp: false,
        geschlecht: false,
        marken: false,
        grosse: false,
        feetFirstFit: false,
        farbe: false,
        preis: false,
        verfugbarkeit: false,
        angebote: false
    });

    const [filters, setFilters] = useState({
        // category: searchParams.get('category') || '',
        typeOfShoes: searchParams.get('typeOfShoes') || '',
        gender: searchParams.get('gender') || '',
        brand: searchParams.get('brand') || '',
        size: searchParams.get('size')?.split(',') || [],
        color: searchParams.get('color') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        availability: searchParams.get('availability') === 'true' || false,
    });

    const [priceRange, setPriceRange] = useState([
        parseInt(searchParams.get('minPrice') || '0'),
        parseInt(searchParams.get('maxPrice') || '5000')
    ]);

    // Filter Options
    const typeOfShoes = ['running', 'walking', 'training', 'hiking'];
    const genders = ['MALE', 'FEMALE', 'UNISEX'];

    const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
    const colors = [
        { name: 'Black', value: 'black' },
        { name: 'White', value: 'white' },
        { name: 'Red', value: 'red' },
        { name: 'Blue', value: 'blue' },
        { name: 'Green', value: 'green' },
        { name: 'Grey', value: 'grey' }
    ];



    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        const params = new URLSearchParams(searchParams);
        
        if (key === 'minPrice' || key === 'maxPrice') {
            if (key === 'minPrice') {
                params.set('minPrice', value);
                params.set('maxPrice', filters.maxPrice || '5000');
            } else {
                params.set('maxPrice', value);
                params.set('minPrice', filters.minPrice || '0');
            }
        } else {
            if (value) {
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        params.set(key, value.join(','));
                    } else {
                        params.delete(key);
                    }
                } else {
                    params.set(key, value);
                }
            } else {
                params.delete(key);
            }
        }
        
        router.push(`/shoes?${params.toString()}`);
    };

    const handleSizeToggle = (size) => {
        const newSizes = filters.size.includes(size)
            ? filters.size.filter(s => s !== size)
            : [...filters.size, size];
        handleFilterChange('size', newSizes);
    };

    const handlePriceRangeChange = (values) => {
        setPriceRange(values);
    };

    const handlePriceInputChange = (type, value) => {
        const numValue = parseInt(value) || 0;
        if (type === 'min') {
            const newMin = Math.max(0, Math.min(numValue, priceRange[1]));
            setPriceRange([newMin, priceRange[1]]);
        } else {
            const newMax = Math.min(5000, Math.max(numValue, priceRange[0]));
            setPriceRange([priceRange[0], newMax]);
        }
    };

    const handlePriceApply = () => {
        const validMinPrice = Math.max(0, Math.min(priceRange[0], 5000));
        const validMaxPrice = Math.max(validMinPrice, Math.min(priceRange[1], 5000));
        const params = new URLSearchParams(searchParams);
        params.set('minPrice', validMinPrice.toString());
        params.set('maxPrice', validMaxPrice.toString());
        router.push(`/shoes?${params.toString()}`);
    };

    const resetFilters = () => {
        setFilters({
            // category: '',
            typeOfShoes: '',
            gender: '',
            brand: '',
            size: [],
            color: '',
            minPrice: '',
            maxPrice: '',
            availability: false,
        });
        router.push('/shoes');
    };

    return (
        <div className="w-full lg:w-80 bg-white shadow-sm rounded-xl sticky top-36">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold">Filter</h2>
                    <button
                        onClick={resetFilters}
                        className="text-sm cursor-pointer text-[#62A07B] hover:underline"
                    >
                        Reset All
                    </button>
                </div>

                {/* Category Filter */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => toggleSection('schuhtyp')}
                        className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                    >
                        <span className="font-pathway-extreme text-sm font-semibold">Schuhtyp</span>
                        <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.schuhtyp ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.schuhtyp && (
                        <div className="py-2 px-4">
                            {typeOfShoes.map((typeOfShoes) => (
                                <div key={typeOfShoes} className="flex items-center space-x-2 py-1">
                                    <Checkbox
                                        id={typeOfShoes}
                                        checked={filters.typeOfShoes === typeOfShoes}
                                        onCheckedChange={() => handleFilterChange('typeOfShoes', filters.typeOfShoes === typeOfShoes ? '' : typeOfShoes)}
                                    />
                                    <Label htmlFor={typeOfShoes} className="capitalize">{typeOfShoes}</Label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Gender Filter */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => toggleSection('geschlecht')}
                        className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                    >
                        <span className="font-pathway-extreme text-sm font-semibold">Geschlecht</span>
                        <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.geschlecht ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.geschlecht && (
                        <div className="py-2 px-4">
                            {genders.map((gender) => (
                                <div key={gender} className="flex items-center space-x-2 py-1">
                                    <Checkbox
                                        id={gender}
                                        checked={filters.gender === gender}
                                        onCheckedChange={() => handleFilterChange('gender', filters.gender === gender ? '' : gender)}
                                    />
                                    <Label htmlFor={gender}>
                                        {gender === 'MALE' ? 'Herren' : gender === 'FEMALE' ? 'Damen' : 'Unisex'}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Color Filter */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => toggleSection('farbe')}
                        className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                    >
                        <span className="font-pathway-extreme text-sm font-semibold">Farbe</span>
                        <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.farbe ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.farbe && (
                        <div className="py-2 px-4">
                            <div className="grid grid-cols-2 gap-2">
                                {colors.map((color) => (
                                    <div
                                        key={color.value}
                                        onClick={() => handleFilterChange('color', filters.color === color.value ? '' : color.value)}
                                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                                            filters.color === color.value ? 'bg-gray-100' : ''
                                        }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full border ${
                                                filters.color === color.value ? 'border-[#62A07B]' : 'border-gray-300'
                                            }`}
                                            style={{ backgroundColor: color.value }}
                                        />
                                        <span>{color.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Size Filter */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => toggleSection('grosse')}
                        className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                    >
                        <span className="font-pathway-extreme text-sm font-semibold">Größe</span>
                        <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.grosse ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.grosse && (
                        <div className="py-2 px-4">
                            <div className="grid grid-cols-4 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeToggle(size)}
                                        className={`p-2 text-sm border rounded-md ${
                                            filters.size.includes(size)
                                                ? 'bg-[#62A07B] text-white border-[#62A07B]'
                                                : 'border-gray-300 hover:border-[#62A07B]'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Price Filter */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => toggleSection('preis')}
                        className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                    >
                        <span className="font-pathway-extreme text-sm font-semibold">Preis</span>
                        <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.preis ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.preis && (
                        <div className="py-4 px-4">
                            <div className="space-y-5">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex-1 relative">
                                        <span className="absolute text-xs text-gray-500 -top-5 left-0 capitalize">Min</span>
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => handlePriceInputChange('min', e.target.value)}
                                            min="0"
                                            max={priceRange[1]}
                                            className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#62A07B] focus:border-transparent"
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                    </div>
                                    <span className="text-gray-400">—</span>
                                    <div className="flex-1 relative">
                                        <span className="absolute text-xs text-gray-500 -top-5 left-0 capitalize">Max</span>
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => handlePriceInputChange('max', e.target.value)}
                                            min={priceRange[0]}
                                            max="5000"
                                            className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#62A07B] focus:border-transparent"
                                            placeholder="5000"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                    </div>
                                </div>
                                
                                <Slider.Root
                                    className="relative flex items-center select-none touch-none w-full h-5"
                                    value={priceRange}
                                    max={5000}
                                    step={10}
                                    minStepsBetweenThumbs={1}
                                    onValueChange={handlePriceRangeChange}
                                >
                                    <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
                                        <Slider.Range className="absolute bg-[#62A07B] rounded-full h-full" />
                                    </Slider.Track>
                                    <Slider.Thumb
                                        className="block w-5 h-5 bg-white border-2 border-[#62A07B] rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#62A07B] focus:ring-offset-2"
                                        aria-label="Min price"
                                    />
                                    <Slider.Thumb
                                        className="block w-5 h-5 bg-white border-2 border-[#62A07B] rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#62A07B] focus:ring-offset-2"
                                        aria-label="Max price"
                                    />
                                </Slider.Root>

                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>0€</span>
                                    <span>2500€</span>
                                    <span>5000€</span>
                                </div>

                                <button
                                    onClick={handlePriceApply}
                                    className="w-full bg-[#62A07B] text-white py-2 px-4 rounded-md hover:bg-[#528c67] transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Availability Filter */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => toggleSection('verfugbarkeit')}
                        className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                    >
                        <span className="font-pathway-extreme text-sm font-semibold">Verfügbarkeit</span>
                        <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.verfugbarkeit ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.verfugbarkeit && (
                        <div className="py-2 px-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="inStock"
                                    checked={filters.availability}
                                    onCheckedChange={(checked) => handleFilterChange('availability', checked)}
                                />
                                <Label htmlFor="inStock">Nur verfügbare Artikel</Label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
