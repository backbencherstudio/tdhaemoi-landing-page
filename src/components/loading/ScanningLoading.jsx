import React from 'react'
import Image from 'next/image'
import springLogo from '../../../public/loading.png'

export default function ScanningLoading() {
    return (
        <div className="loading-container ">
            <div className="relative flex items-center justify-center ">
                <div className="spinner"></div>
                <Image
                    src={springLogo}
                    alt="logo"
                    width={100}
                    height={100}
                    className="w-16 h-16 z-10 object-contain p-1"
                />
            </div>
            <p className='mt-16 text-lg text-white font-semibold'>Analyzing your 3D-Scan for the perfect fit.....</p>
        </div>
    )
}
