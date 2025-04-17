'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import { getAllProducts } from '@/apis/productsApis';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { Button } from "@/components/ui/button"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react"
const colorMap = {
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#FF0000': 'Red',
    '#0000FF': 'Blue',
    '#008000': 'Green',
    '#FFFF00': 'Yellow',
    '#FFA500': 'Orange',
    '#800080': 'Purple',
    '#A52A2A': 'Brown',
    '#808080': 'Gray',
    '#FFC0CB': 'Pink',
    '#40E0D0': 'Turquoise',
    '#FFD700': 'Gold',
    '#C0C0C0': 'Silver',
    '#ADD8E6': 'Light Blue',
    '#90EE90': 'Light Green',
    '#FFB6C1': 'Light Pink',
    '#D3D3D3': 'Light Gray',
    '#F08080': 'Light Coral',
    '#E6E6FA': 'Lavender',
    '#00FFFF': 'Cyan',
    '#8B0000': 'Dark Red',
    '#006400': 'Dark Green',
    '#00008B': 'Dark Blue',
    '#B22222': 'Fire Brick',
    '#DAA520': 'Goldenrod',
    '#F5DEB3': 'Wheat',
    '#FFE4C4': 'Bisque',
    '#D2691E': 'Chocolate',
    '#FA8072': 'Salmon',
    '#FF1493': 'Deep Pink',
    '#7FFFD4': 'Aquamarine',
    '#B0E0E6': 'Powder Blue',
    '#DC143C': 'Crimson',
    '#4B0082': 'Indigo',
    '#2F4F4F': 'Dark Slate Gray',
    '#708090': 'Slate Gray',
};
export default function Shoes() {
    const [shoes, setShoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [typeOfShoes, setTypeOfShoes] = useState('');
    const currentPage = Number(searchParams.get('page')) || 1;
    const itemsPerPage = 8;
    const [totalItems, setTotalItems] = useState(0);

    // Add this useEffect at the top of your existing useEffects
    useEffect(() => {
        const handleInitialLoad = () => {
            const params = new URLSearchParams(searchParams);
            const currentPage = params.get('page');

            // If no page parameter and no other filters are present
            if (!currentPage && !hasActiveFilters()) {
                params.set('page', '1');
                router.replace(`/shoes?${params.toString()}`, { scroll: false });
            }
        };

        const hasActiveFilters = () => {
            const params = new URLSearchParams(searchParams);
            const filterParams = [
                'search', 'typeOfShoes', 'gender', 'color',
                'size', 'minPrice', 'maxPrice', 'availability'
            ];
            return filterParams.some(param => params.has(param));
        };

        handleInitialLoad();
    }, []);

    // Update fetchShoes to use the new search pattern
    const fetchShoes = async () => {
        try {
            setLoading(true);
            const filters = {
                search: searchParams.get('search') || '',
                typeOfShoes: searchParams.get('typeOfShoes') || '',
                subCategory: searchParams.get('subCategory') || '',
                color: searchParams.get('color') || '',
                size: searchParams.get('size') || '',
                minPrice: searchParams.get('minPrice') || '',
                maxPrice: searchParams.get('maxPrice') || '',
                gender: searchParams.get('gender') || '',
                page: currentPage,
                limit: itemsPerPage
            };

            // Keep the old data while loading new data
            const response = await getAllProducts(filters);

            // Only update state if the component is still mounted and the page hasn't changed
            if (currentPage === Number(searchParams.get('page'))) {
                setShoes(response.products);
                setTotalItems(response.total);
                setTotalPages(response.totalPages);
            }
        } catch (error) {
            console.error('Error fetching shoes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update search params handling
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearchTerm) {
            params.set('search', debouncedSearchTerm);
            params.set('page', '1');
        } else {
            params.delete('search');
            // Ensure page parameter exists when removing search
            if (!params.has('page')) {
                params.set('page', '1');
            }
        }
        if (typeOfShoes) {
            params.set('typeOfShoes', typeOfShoes);
        } else {
            params.delete('typeOfShoes');
        }
        router.push(`/shoes?${params.toString()}`);
    }, [debouncedSearchTerm, typeOfShoes]);

    // Watch for URL parameter changes
    useEffect(() => {
        fetchShoes();
    }, [searchParams]);

    // Update search handler
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    // Initialize searchTerm from URL on component mount
    useEffect(() => {
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl) {
            setSearchTerm(searchFromUrl);
        }
    }, []);

    // Update page change handler
    const handlePageChange = (page) => {
        if (page === currentPage || loading) return;

        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        router.push(`/shoes?${params.toString()}`, { scroll: false });
    };

    // Generate array of page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of visible pages
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Add ellipsis after first page if needed
            if (start > 2) {
                pages.push('...');
            }

            // Add visible pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    useEffect(() => {
        if (!searchParams.get('page')) {
            const params = new URLSearchParams(searchParams);
            params.set('page', '1');
            router.replace(`/shoes?${params.toString()}`);
        }
    }, []);

    const ProductCard = ({ shoe }) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const [currentColorIndex, setCurrentColorIndex] = useState(0);
        const currentVariant = shoe.colorVariants[currentColorIndex];

        // Create array of first images from each color variant
        const colorImages = shoe.colorVariants.map(variant => variant.mainImage);

        useEffect(() => {
            let interval;
            if (currentImageIndex >= colorImages.length) {
                setCurrentImageIndex(0);
            }
            return () => clearInterval(interval);
        }, [currentImageIndex, colorImages.length]);

        const handleMouseEnter = () => {
            // Start cycling through color variants
            setCurrentImageIndex(0);
            const interval = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % colorImages.length);
            }, 1000); // Change image every second
            return interval;
        };

        const handleMouseLeave = (interval) => {
            clearInterval(interval);
            setCurrentImageIndex(0);
        };

        return (
            <Link
                href={`/shoes/details/${shoe.id}/${shoe.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
                <div
                    className="bg-white rounded-lg shadow-md transform transition-all duration-300 hover:shadow-xl cursor-pointer max-w-sm mx-auto"
                    onMouseEnter={() => {
                        const interval = handleMouseEnter();
                        // Store the interval ID as a data attribute
                        document.getElementById(`shoe-${shoe.id}`).dataset.intervalId = interval;
                    }}
                    onMouseLeave={() => {
                        const interval = document.getElementById(`shoe-${shoe.id}`).dataset.intervalId;
                        handleMouseLeave(interval);
                    }}
                    id={`shoe-${shoe.id}`}
                >
                    <div className="aspect-square bg-[#e8e8e8] relative mb-4 flex items-center justify-center rounded-t-lg overflow-hidden">
                        {colorImages.length > 0 ? (
                            <Image
                                src={colorImages[currentImageIndex]}
                                width={300}
                                height={300}
                                alt={`${shoe.name} - ${shoe.colorVariants[currentImageIndex]?.name}`}
                                className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                                No image available
                            </div>
                        )}
                    </div>
                    <div className="space-y-2 px-4 pb-4">
                        <h3 className="font-pathway-extreme font-bold text-lg truncate">{shoe.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{shoe.description}</p>

                        <div className="flex items-center gap-2">
                            <p>Farbe: </p>
                            {shoe.colorVariants.map((variant, index) => (
                                <div
                                    key={index}
                                    className={`w-4 h-4 rounded-full border border-gray-200`}
                                    style={{ backgroundColor: variant.code }}
                                    title={variant.name}
                                />
                            ))}
                        </div>
                        <p className="font-semibold text-lg">{Number(shoe.price).toFixed(2)} €</p>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <>
            {/* Search Bar */}
            <div className="pb-5">
                <div className="flex justify-end mt-3 mb-7">
                    <div className="relative w-full max-w-md ml-auto">
                        <div className={`flex items-center border border-gray-300 bg-white rounded-lg shadow-sm transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-[#62A07B]' : ''}`}>
                            <FiSearch className="ml-4 text-gray-500 text-xl" />
                            <input
                                type="text"
                                placeholder="Suchen Sie nach Schuhen..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full px-4 py-3 rounded-lg focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62A07B]"></div>
                </div>
            )}

            {/* No results */}
            {!loading && shoes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                    <FiSearch className="text-6xl text-gray-400 mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">Keine Ergebnisse gefunden</h3>
                    <p className="text-gray-500">
                        Leider konnten wir keine Schuhe finden, die Ihrer Suche entsprechen.
                    </p>
                </div>
            )}

            {/* Shoes Grid */}
            {!loading && shoes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {shoes.map((shoe) => (
                        <ProductCard key={shoe.id} shoe={shoe} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
                    Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} shoes
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2">...</span>
                        ) : (
                            <Button
                                key={`page-${page}`}
                                variant={currentPage === page ? "default" : "outline"}
                                size="icon"
                                className={`h-8 w-8 ${currentPage === page ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        )
                    ))}

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>

                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md ml-2">
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            </div>
        </>
    )
}
