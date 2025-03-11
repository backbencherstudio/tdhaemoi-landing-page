'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Categories() {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch('/data/categories.json')
            const data = await response.json()
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    return (
        <div className="flex justify-center">
            <div className="w-[1440px] grid grid-cols-3 gap-4">
                {categories.map((category) => (
                    <Link 
                        key={category.id}
                        href={`/categories/${category.id}`}
                        className="relative group h-[500px] md:h-[800px] xl:h-[940px] block overflow-hidden"
                    >
                        <div className="w-full h-full">
                            <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                className="bg-black/90 transition-transform duration-500 "
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
    )
}