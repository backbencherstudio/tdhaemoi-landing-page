import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import footScanImage from '../../public/leg.png'
import LoadingSpring from '@/components/loading/LoadingSpring'
import { IoClose } from "react-icons/io5"

export default function ScanningDetailsModal({ onClose }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    const handleQuestionsClick = () => {
        const currentParams = new URLSearchParams(searchParams.toString());
        router.push(`/question?${currentParams.toString()}`);
    };

    const handleShoesClick = () => {
        setIsLoading(true)
        setTimeout(() => {
            router.push('/shoes')
        }, 500)
    }

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-black text-white w-full max-w-5xl overflow-y-auto max-h-[90vh] relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 text-white hover:opacity-80 z-10"
                >
                    <IoClose size={24} />
                </button>

                {/* Success Banner */}
                <div className="bg-[#5B9279] py-6 px-4 text-center">
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Dein Scan wurde erfolgreich verarbeitet!
                    </h1>
                </div>

                {/* Main Content */}
                <div className="px-4 py-8">
                    <div className="max-w-5xl mx-auto px-5">
                        {/* Scan Results Section */}
                        <div className="mb-12">
                            <h2 className="text-xl md:text-2xl font-semibold mb-8">
                                DEINE INDIVIDUELLEN SCANERGEBNISSE
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-8">
                                {/* Left Side - Measurements */}
                                <div>
                                    {/* Left Foot Measurements */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Fußlänge Links</p>
                                            <input
                                                type="text"
                                                value="Fußlänge Links 258,6"
                                                readOnly
                                                className="w-full bg-transparent border border-gray-800 p-2 text-white focus:outline-none cursor-default"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Fußlänge Rechts</p>
                                            <input
                                                type="text"
                                                value="Fußlänge Rechts 256,3"
                                                readOnly
                                                className="w-full bg-transparent border border-gray-800 p-2 text-white focus:outline-none cursor-default"
                                            />
                                        </div>
                                    </div>

                                    {/* Width Measurements */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Fußbreite Links</p>
                                            <input
                                                type="text"
                                                value="Fußbreite Links 108,6"
                                                readOnly
                                                className="w-full bg-transparent border border-gray-800 p-2 text-white focus:outline-none cursor-default"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Fußbreite Rechts</p>
                                            <input
                                                type="text"
                                                value="Fußbreite Rechts 106,3"
                                                readOnly
                                                className="w-full bg-transparent border border-gray-800 p-2 text-white focus:outline-none cursor-default"
                                            />
                                        </div>
                                    </div>

                                    {/* Heel Measurements */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Fersenneigung Links</p>
                                            <input
                                                type="text"
                                                value="Normal"
                                                readOnly
                                                className="w-full bg-transparent border border-gray-800 p-2 text-white focus:outline-none cursor-default"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Fersenneigung Rechts</p>
                                            <input
                                                type="text"
                                                value="Überpronation"
                                                readOnly
                                                className="w-full bg-transparent border border-gray-800 p-2 text-white focus:outline-none cursor-default"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - 3D Foot Image */}
                                <div className="flex items-center justify-center">
                                    <Image
                                        src={footScanImage}
                                        alt="3D Foot Scan"
                                        width={400}
                                        height={300}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className='border-gray-800 my-8' />

                        {/* Bottom Section */}
                        <div className="text-center space-y-6">
                            <h3 className="text-xl">
                                Möchtest du dein Erlebnis noch individueller gestalten?
                            </h3>

                            <div className="flex flex-col lg:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleShoesClick}
                                    className="bg-[#5B9279] cursor-pointer text-white px-8 py-3 rounded text-sm hover:bg-opacity-90 transition-all whitespace-nowrap"
                                >
                                    NEIN, DIREKT MEINE SCHUH-EMPFEHLUNGEN ERHALTEN
                                </button>
                                <button
                                    onClick={handleQuestionsClick}
                                    className="bg-[#5B9279] cursor-pointer text-white px-8 py-3 rounded text-sm hover:bg-opacity-90 transition-all whitespace-nowrap"
                                >
                                    JA, ICH WILL NOCH DEN PRÄZISEREN SCHUH FINDEN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
                        <LoadingSpring />
                    </div>
                )}
            </div>
        </div>
    )
}
