import React from 'react'
import logo from '../../../public/logo/logo.png'
import Image from 'next/image'

export default function LoadingSpring() {
    return (
        <div className="loading-container ">
            <div className="relative flex items-center justify-center ">
                <div className="spinner"></div>
                <Image 
                    src={logo} 
                    alt="logo" 
                    width={100} 
                    height={100} 
                    className="w-16 h-16 z-10 object-contain p-1"
                />
            </div>
            <p className='mt-16 text-lg text-white font-semibold'>Finding your perfect Shoe...</p>
        </div>
    )
}
