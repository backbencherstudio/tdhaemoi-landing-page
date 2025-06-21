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

const descriptions = {
    'Radschuhe': 'Jeder Tritt - volle Effizienz.',
    'Laufschuhe': 'Dein Lauf - deine Dynamik.',
    'Tennisschuhe': 'Schnelle Schritte - volle Kontrolle.',
    'Basketballschuhe': 'Schnelle Moves - sichere Landung.',
    'Kletterschuhe': 'Präziser Tritt - maximaler Grip.',
    'Fussballschuhe': 'Dein Spiel - perfekter Grip.',
    'Golfschuhe': 'Fester Stand - kontrollierter Schwung.',
};

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

            // Add slugs and descriptions to subcategories
            const subCategoriesWithData = currentCategory.data?.map(subCat => ({
                ...subCat,
                slug: subCat.slug || subCat.title.toLowerCase().replace(/\s+/g, '-'),
                description: descriptions[subCat.title] || ''
            })) || []

            setCategory(currentCategory)
            setSubCategories(subCategoriesWithData)
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

    const leftColumnSubcategories = subCategories.filter((_, index) => index % 2 === 0);
    const rightColumnSubcategories = subCategories.filter((_, index) => index % 2 !== 0);

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

                    <div className='mt-4'>
                        <h1 className='text-white uppercase text-2xl md:text-4xl'>Starte dein persönliches Sporterlebnis</h1>
                        <p className="text-white capitalize text-xl font-light mt-4">
                            Wähle deine Sportart und profitiere von individuellen Empfehlungen – für maximale Performance.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-36 justify-center">
                    <div className="flex flex-col gap-8 lg:gap-28 md:w-1/2">
                        {leftColumnSubcategories.map((subCategory, index) => (
                            <div
                                key={subCategory.id}
                                className="flex flex-col md:flex-row items-center gap-4 md:gap-6"

                            >
                                <div className="w-full md:w-1/2 order-2 md:order-1 text-right">
                                    <h2 className="text-white text-xl md:text-2xl font-bold">
                                        {subCategory.title}
                                    </h2>
                                    <p className="text-white text-base mt-2">{subCategory.description}</p>
                                    <div className="mt-4">
                                        <button onClick={() => handleImageClick(subCategory)} className="bg-white text-black font-semibold py-2 px-8 transform duration-300 -skew-x-[20deg] hover:bg-gray-300 transition-opacity cursor-pointer">
                                            <span className="inline-block transform skew-x-[20deg]">
                                                Passenden Schuh finden
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 order-1 md:order-2 group relative overflow-hidden rounded-lg cursor-pointer"
                                    onClick={() => handleImageClick(subCategory)}
                                >
                                    <Image
                                        src={subCategory.image}
                                        alt={subCategory.title}
                                        width={300}
                                        height={300}
                                        className="w-full transition-transform duration-500 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-8 lg:gap-28 md:w-1/2 md:mt-24 lg:mt-48">
                        {rightColumnSubcategories.map((subCategory, index) => (
                            <div
                                key={subCategory.id}
                                className="flex flex-col md:flex-row items-center   gap-4 md:gap-6"

                            >
                                <div className="w-full md:w-1/2 relative overflow-hidden rounded-lg cursor-pointer group"
                                    onClick={() => handleImageClick(subCategory)}
                                >
                                    <Image

                                        src={subCategory.image}
                                        alt={subCategory.title}
                                        width={300}
                                        height={300}
                                        className="w-full transition-transform duration-500 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                                </div>
                                <div className="w-full md:w-1/2 text-left">
                                    <h2 className="text-white text-xl md:text-2xl font-bold">
                                        {subCategory.title}
                                    </h2>
                                    <p className="text-white text-base mt-2">{subCategory.description}</p>
                                    <div className="mt-4">
                                        <button onClick={() => handleImageClick(subCategory)} className="bg-white text-black font-semibold py-2 px-8 transform -skew-x-[20deg] hover:opacity-90 transition-opacity cursor-pointer">
                                            <span className="inline-block transform skew-x-[20deg]">
                                                Passenden Schuh finden
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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