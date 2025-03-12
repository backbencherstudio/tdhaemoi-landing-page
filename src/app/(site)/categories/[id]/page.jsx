'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '../../../../../public/categoryData/logo.png'
import FormModal from '../../../../components/FormModal'
import Link from 'next/link'

const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );

export default function CategoryPage({ params }) {
    const categoryId = React.use(params).id
    const [category, setCategory] = useState(null)
    const [subCategories, setSubCategories] = useState([])
    const [selectedSubCategory, setSelectedSubCategory] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchCategoryData()
    }, [categoryId])

    const fetchCategoryData = async () => {
        try {
            const response = await fetch('/data/categories.json')
            const data = await response.json()
            const currentCategory = data.find(cat => cat.id === parseInt(categoryId))
            setCategory(currentCategory)
            setSubCategories(currentCategory?.data || [])
        } catch (error) {
            console.error('Error fetching category data:', error)
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

    return (
        <div className="flex justify-center bg-black min-h-screen">
            <div className="w-[1440px] py-12 px-4">
                <div className="text-center mb-16">
                    <Link href='/'>
                        <Image
                            src={logo}
                            alt="Logo"
                            width={500}
                            height={100}
                            className="mx-auto w-[90px] h-[110px] mb-10"
                        />
                    </Link>
                    <h1 className="text-white text-2xl font-semibold">
                        Choose the category for your perfect fitting sport shoes
                    </h1>
                </div>

                <div className="relative">
                    <table className="w-full border-separate border-spacing-x-16">
                        <tbody>
                            {chunk(subCategories, 3).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((subCategory, colIndex) => (
                                        <td key={subCategory.id} className={`w-1/3 ${colIndex === 1 ? 'pt-14' : ''}`}>
                                            <div className="flex flex-col items-center cursor-pointer group" onClick={() => handleImageClick(subCategory)}>
                                                <div className="aspect-[4/3] w-full relative overflow-hidden">
                                                    <Image
                                                        src={subCategory.image}
                                                        alt={subCategory.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 "
                                                        priority
                                                        quality={100}
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                                                </div>
                                                <h2 className="text-white text-xl font-semibold mt-4 transform transition-transform duration-300 group-hover:scale-105">
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
                        selectedSubCategory: selectedSubCategory ? {
                            id: selectedSubCategory.id,
                            title: selectedSubCategory.title,
                            image: selectedSubCategory.image
                        } : null
                    }}
                />
            </div>
        </div>
    )
}