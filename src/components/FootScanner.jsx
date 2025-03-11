import React from 'react'

import Image from 'next/image'
import leftImg from '../../public/legs/left.png'
import rightImg from '../../public/legs/right.png'
import logo from '../../public/categoryData/logo.png'
import Link from 'next/link'

export default function FootScanner() {
    return (
        <div className='flex flex-col min-h-screen'>
            {/* Header Section */}
            <div className="w-full bg-black py-4">
                <div className="container mx-auto px-4">
                    <div className="text-[#62a07b] text-4xl font-bold">
                        <div className='flex justify-center items-center'>
                            <Link href='/'>
                                <Image
                                    src={logo}
                                    alt="Logo"
                                    height={500}
                                    width={500}
                                    className="h-full w-auto"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex-1 flex justify-center items-center'>
                <div className="container ">
                    <div className="w-full flex flex-wrap justify-center items-start">
                        {/* Left Foot Section */}
                        <div className="w-full md:w-[30%] px-2 mb-6">
                            <div className='flex border-2 border-gray-600 flex-col justify-center items-center h-[330px] relative'>
                                <Image alt='left-leg' src={leftImg} width={200} height={300} className='w-[200px] h-[330px]' />
                            </div>
                            <button className="bg-[#62a07b] cursor-pointer text-white px-8 py-2 rounded-full w-full text-sm md:text-base mt-4">
                                SCAN
                            </button>
                        </div>

                        {/* Instructions Section */}
                        <div className="w-full md:w-[40%] px-4 mb-6">
                            <h2 className="text-lg md:text-xl font-semibold text-center mb-4">WIE FUNKTIONIERTS?</h2>
                            <div className="space-y-3 text-sm md:text-base">
                                <p>1) Linken Fuß mittig auf die Scan-Fläche stellen und auf gleichmäßigen Abstand achten.</p>
                                <p>2) Still stehen und „Scan starten" drücken. Warten, bis der Balken voll ist.</p>
                                <p>3) Nach dem Scan den rechten Fuß scannen und den Vorgang wiederholen.</p>
                                <p className="font-semibold">Wichtig: Nicht bewegen, um ein genaues Ergebnis zu erhalten.</p>
                            </div>
                        </div>

                        {/* Right Foot Section */}
                        <div className="w-full md:w-[30%] px-2 mb-6">
                            <div className='flex border-2 border-gray-600 flex-col justify-center items-center h-[330px] relative'>
                                <Image alt='right-leg' src={rightImg} width={200} height={300} className='w-[200px] h-[330px]' />
                            </div>
                            <button
                                className="bg-[#62a07b] cursor-pointer text-white px-8 py-2 rounded-full w-full text-sm md:text-base mt-4"
                            >
                                SCAN
                            </button>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    )
}
