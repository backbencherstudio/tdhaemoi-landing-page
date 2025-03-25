'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../../../../../public/categoryData/logo.png'
import FormModal from '../../../../components/FormModal'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LoadingSpring from '@/components/loading/LoadingSpring'

const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );

// Update the chunk function to be responsive
const getChunkSize = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 768 ? 2 : 3;
    }
    return 3;
}

export default function CategoryPage({ params }) {
    const router = useRouter()
    const unwrappedParams = React.use(params)
    const { slug } = unwrappedParams
    const [category, setCategory] = useState(null)
    const [subCategories, setSubCategories] = useState([])
    const [selectedSubCategory, setSelectedSubCategory] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [chunkSize, setChunkSize] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            setChunkSize(getChunkSize());
        };

        // Set initial chunk size
        setChunkSize(getChunkSize());

        // Add resize listener
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchCategoryData()
    }, [slug])


    const fetchCategoryData = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/data/categories.json')
            const data = await response.json()
            const currentCategory = data.find(cat => cat.slug === slug)

            if (!currentCategory) {
                console.error('Category not found')
                router.push('/categories')
                return
            }

            // Add slugs to subcategories if they don't exist
            const subCategoriesWithSlugs = currentCategory.data?.map(subCat => ({
                ...subCat,
                slug: subCat.slug || subCat.title.toLowerCase().replace(/\s+/g, '-')
            })) || []

            setCategory(currentCategory)
            setSubCategories(subCategoriesWithSlugs)
        } catch (error) {
            console.error('Error fetching category data:', error)
            router.push('/categories')
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageClick = (subCategory) => {
        setSelectedSubCategory(subCategory)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedSubCategory(null)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
                <div>Loading...</div>
            </div>
        )
    }

    if (!category) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black">
                <div className="text-white text-2xl">Category not found</div>
            </div>
        )
    }

    return (
        <div className="flex justify-center bg-black min-h-screen">
            <div className="w-full max-w-[1440px] py-8 md:py-12 px-4">
                <div className="text-center mb-16">
                    <Link href='/'>
                        <Image
                            src={logo}
                            alt="Logo"
                            width={500}
                            height={100}
                            className="mx-auto w-[90px] h-[110px] mb-10"
                            priority
                        />
                    </Link>

                    <p className="text-white uppercase text-2xl md:text-3xl  mt-4">
                    Wählen Sie Ihre Kategorie und finden Sie Ihren perfekten Schuh.
                    </p>
                </div>

                <div className="relative">
                    <table className="w-full border-separate border-spacing-x-2 sm:border-spacing-x-4 md:border-spacing-x-8 lg:border-spacing-x-16">
                        <tbody>
                            {chunk(subCategories, chunkSize).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((subCategory, colIndex) => (
                                        <td
                                            key={subCategory.id}
                                            className={`${chunkSize === 2 ? 'w-1/2' : 'w-1/3'} 
                                            ${chunkSize === 3 && colIndex === 1 ? 'pt-4 md:pt-14' : ''}`}
                                        >
                                            <div className="flex flex-col items-center cursor-pointer group"
                                                onClick={() => handleImageClick(subCategory)}>
                                                <div className="w-full relative overflow-hidden rounded-lg">
                                                    <Image
                                                        src={subCategory.image}
                                                        alt={subCategory.title}
                                                        width={500}
                                                        height={500}
                                                        className="w-full transition-transform duration-500 group-hover:scale-105"
                                                        priority
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                                                </div>
                                                <h2 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mt-2 md:mt-4 transform transition-transform duration-300 group-hover:scale-105 text-center">
                                                    {subCategory.title}
                                                </h2>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <FormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    categoryData={{
                        id: category?.id,
                        title: category?.title,
                        slug: category?.slug,
                        questions: category?.questions,
                        selectedSubCategory: selectedSubCategory ? {
                            id: selectedSubCategory.id,
                            title: selectedSubCategory.title,
                            slug: selectedSubCategory.slug,
                            image: selectedSubCategory.image,
                            questions: selectedSubCategory.questions
                        } : null
                    }}
                />
            </div>
        </div>
    )
} 