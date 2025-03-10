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
                    <div key={category.id} className="relative group cursor-pointer h-[500px] md:h-[800px] xl:h-[940px]" >
                        <div className="w-full h-full">
                            <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                className=" bg-black/90"
                                priority
                                quality={100}
                                loading="eager"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h2 className="text-white font-Inter text-2xl lg:text-3xl xl:text-3xl font-bold uppercase">{category.title}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}