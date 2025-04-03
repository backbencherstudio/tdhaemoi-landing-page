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
    const [showConfirmation, setShowConfirmation] = useState(false)

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

    const handleEndClick = () => {
        setShowConfirmation(true)
    }

    const handleConfirm = (confirmed) => {
        if (confirmed) {
            onClose()
            router.push('/')
        }
        setShowConfirmation(false)
    }

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-5">
            <div className="bg-white  w-full max-w-5xl overflow-y-auto max-h-[85vh] relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 text-white hover:opacity-80 z-10"
                >
                    <IoClose size={24} />
                </button>

                {/* Success Banner */}
                <div className="bg-[#5B9279] py-6 px-4 text-center">
                    <h1 className="text-2xl  font-semibold text-white uppercase">
                        Dein Scan wurde erfolgreich verarbeitet!
                    </h1>
                </div>

                {/* Main Content */}
                <div className="px-4 py-8">
                    <div className="max-w-5xl mx-auto px-5">
                        {/* Scan Results Section */}
                        <div className="mb-6">
                            <div className='text-center'>
                                <h2 className="text-xl md:text-2xl font-semibold mb-2 text-black">
                                    MÖCHTEST DU DEIN ERLEBNIS NOCH INDIVIDUELLER GESTALTEN?

                                </h2>
                                <p className=''>  BEANTWORTE EIN PAAR GEZIELTE FRAGEN – ENTWICKELT MIT EXPERT:INNEN, UM DEINEN PERFEKTEN SCHUHE ZU FINDEN.</p>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-4 justify-center mt-6">
                                <button
                                    onClick={handleShoesClick}
                                    className="bg-[#5B9279] border border-black cursor-pointer text-white px-8 py-6 rounded text-sm hover:bg-opacity-90 transition-all whitespace-nowrap"
                                >
                                    NEIN, DIREKT MEINE SCHUH-EMPFEHLUNGEN ERHALTEN
                                </button>
                                <button
                                    onClick={handleQuestionsClick}
                                    className="bg-[#5B9279] border border-black cursor-pointer text-white px-8 py-6 rounded text-sm hover:bg-opacity-90 transition-all whitespace-nowrap"
                                >
                                    JA, ICH WILL NOCH DEN PRÄZISEREN SCHUH FINDEN
                                </button>
                            </div>

                            <div className='my-10'>
                                <hr className='border border-gray-500 ' />
                            </div>

                            <div>
                                <h1 className='text-xl font-semibold text-black uppercase mb-2'>Deine Individuellen scanergebnisse</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-8">
                                    {/* Left Side - Measurements */}
                                    <div>
                                        {/* Left Foot Measurements */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">Fußlänge Links</p>
                                                <input
                                                    type="text"
                                                    value="258,6 mm"
                                                    readOnly
                                                    className="w-full bg-transparent border border-gray-800 p-2 text-black focus:outline-none cursor-default"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">Fußlänge Rechts</p>
                                                <input
                                                    type="text"
                                                    value="256,3 mm"
                                                    readOnly
                                                    className="w-full bg-transparent border border-gray-800 p-2 text-black focus:outline-none cursor-default"
                                                />
                                            </div>
                                        </div>

                                        {/* Width Measurements */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">Fußbreite Links</p>
                                                <input
                                                    type="text"
                                                    value="108,6 mm"
                                                    readOnly
                                                    className="w-full bg-transparent border border-gray-800 p-2 text-black focus:outline-none cursor-default"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">Fußbreite Rechts</p>
                                                <input
                                                    type="text"
                                                    value="106,3 mm"
                                                    readOnly
                                                    className="w-full bg-transparent border border-gray-800 p-2 text-black focus:outline-none cursor-default"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - 3D Foot Image */}
                                    <div className="flex items-center justify-center border">
                                        <Image
                                            src={footScanImage}
                                            alt="3D Foot Scan"
                                            width={300}
                                            height={200}
                                            className="object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="text-center mt-6">
                                    <p className="text-gray-600 mb-4">
                                        QR-Code per E-Mail erhalten und persönliches Erlebnis in der Shoe Finder App genießen
                                    </p>
                                    <button
                                        onClick={handleEndClick}
                                        className="bg-[#5B9279] text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all"
                                    >
                                        Jetzt beenden
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {showConfirmation && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                        <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
                            <h3 className="text-xl font-semibold mb-4 text-center">
                                Sind Sie sicher dass Sie FeetF1rst beenden wollen?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => handleConfirm(true)}
                                    className="bg-[#5B9279] cursor-pointer text-white px-6 py-2 rounded hover:bg-opacity-90"
                                >
                                    Ja
                                </button>
                                <button
                                    onClick={() => handleConfirm(false)}
                                    className="bg-gray-500 text-white cursor-pointer px-6 py-2 rounded hover:bg-opacity-90"
                                >
                                    Nein
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
