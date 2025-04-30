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
import ProductCard from '../shared/ProductCard';

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
    const [error, setError] = useState(null);

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


    useEffect(() => {
        const currentSizes = searchParams.getAll('size[]');
        if (currentSizes.length > 0) {

            const timeoutId = setTimeout(() => {
                fetchShoes();
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [searchParams]);


    const fetchShoes = async () => {
        try {
            setLoading(true);
            setError(null);
            const filters = {
                search: searchParams.get('search') || '',
                typeOfShoes: Array.from(searchParams.getAll('typeOfShoes[]')),
                brand: searchParams.get('brand') || '',
                subCategory: searchParams.get('subCategory') || '',
                colors: Array.from(searchParams.getAll('colorName[]')),
                size: Array.from(searchParams.getAll('size[]')).sort(),
                minPrice: searchParams.get('minPrice') || '',
                maxPrice: searchParams.get('maxPrice') || '',
                gender: searchParams.get('gender') || '',
                page: currentPage,
                limit: itemsPerPage
            };

            const response = await getAllProducts(filters);

            if (response.error) {
                setError(response.message);
                setShoes([]);
                setTotalItems(0);
                setTotalPages(0);
                return;
            }

            if (currentPage === Number(searchParams.get('page'))) {
                setShoes(response.products);
                setTotalItems(response.total);
                setTotalPages(response.totalPages);
            }
        } catch (error) {
            console.error('Error fetching shoes:', error);
            setError('Failed to fetch shoes. Please try again later.');
            setShoes([]);
            setTotalItems(0);
            setTotalPages(0);
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

    useEffect(() => {
        fetchShoes();
    }, [searchParams]);
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    useEffect(() => {
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl) {
            setSearchTerm(searchFromUrl);
        }
    }, []);

    // Update page change handler
    const handlePageChange = (page) => {
        if (loading || totalItems === 0) return;

        if (page < 1 || page > totalPages) return;
        if (page === currentPage) return;

        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        router.push(`/shoes?${params.toString()}`, { scroll: false });
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            if (start > 2) {
                pages.push('...');
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (end < totalPages - 1) {
                pages.push('...');
            }
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

    const filteredShoes = shoes.filter(shoe => {
        const selectedColorNames = Array.from(searchParams.getAll('colorName[]'));
        return selectedColorNames.length === 0 ||
            shoe.colorVariants.some(variant =>
                selectedColorNames.includes(variant.name.toLowerCase())
            );
    });

    return (
        <div className="px-4">
            {/* Search Bar */}
            <div className="flex justify-end  mb-5">
                {/* drop down sub category */}
                <div >
                    {/* sub category */}
                </div>
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

            {/* Error state */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                    <p>{error}</p>
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="min-h-[500px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : filteredShoes.length === 0 ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                    <p className="text-center">
                        Please try different filters or search terms.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredShoes.map((shoe) => (
                        <ProductCard key={shoe.id} shoe={shoe} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalItems > 0 && (
                <div className="flex items-center justify-between px-6 py-10  ">
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
                        Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} shoes
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1 || loading || totalItems === 0}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading || totalItems === 0}
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
                                    disabled={loading || totalItems === 0}
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
                            disabled={currentPage === totalPages || loading || totalItems === 0}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages || loading || totalItems === 0}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>

                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md ml-2">
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
