'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import LoadingSpring from '@/components/loading/LoadingSpring' 
import FormModal from '@/components/FormModal'
import { useSearchParams } from 'next/navigation'

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [submittedData, setSubmittedData] = useState(null)

    const searchParams = useSearchParams()

    useEffect(() => {
        // Get and parse the submitted data from URL if it exists
        const data = searchParams.get('data')
        if (data) {
            try {
                const decodedData = JSON.parse(decodeURIComponent(data))
                setSubmittedData(decodedData)
                // console.log('Received Form Data:', decodedData)
            } catch (error) {
                console.error('Error parsing data:', error)
            }
        }

        fetchCategories()
    }, [searchParams])

    const fetchCategories = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/data/categories.json')
            const data = await response.json()

            const categoriesWithSlugs = data.map(category => ({
                ...category,
                slug: category.slug || category.title
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
            }))
            setCategories(categoriesWithSlugs)
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCategoryClick = (e, category) => {
        if (category.slug === 'alltagsschuhe' || category.slug === 'berg-trekkingschuhe') {
            e.preventDefault()
            setSelectedCategory(category)
            setIsModalOpen(true)
            // console.log('Selected category:', category) 
        }
    }

    // Display submitted data section if it exists
    const renderSubmittedData = () => {
        if (!submittedData) return null;

        return (
            <div className="w-full mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Submitted Form Data:</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(submittedData, null, 2)}
                </pre>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
                Loading...
            </div>
        )
    }

    return (
        <>
            {renderSubmittedData()}
            <div className="flex justify-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => (
                        <Link
                            key={category?.id}
                            href={`/categories/${category.slug}`}
                            className="relative group h-[500px] md:h-[845px] xl:h-[945px]"
                            onClick={(e) => handleCategoryClick(e, category)}
                        >
                            <div className="w-full h-full">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="bg-black/90 transition-transform duration-500 object-cover"
                                    priority
                                    quality={100}
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-Inter text-2xl xl:text-3xl font-bold uppercase transform transition-transform duration-300 group-hover:scale-105">
                                    {category.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <FormModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedCategory(null)
                    }}
                    category={selectedCategory}
                />
            )}
        </>
    )
}