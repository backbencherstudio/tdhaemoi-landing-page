import React, { useState } from 'react';
import Image from 'next/image';
import { IoClose } from "react-icons/io5";
import qrCode from '../../public/qrscanner.png';
import ScanningLoading from './loading/ScanningLoading';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessModal({ onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClose = () => {
        setIsLoading(true);
        
        // Get all URL parameters and pass them along
        const currentParams = new URLSearchParams(searchParams.toString());
        
        setTimeout(() => {
            onClose();
            setTimeout(() => {
                setIsLoading(false);
            }, 5000);
        }, 1000);
        
        router.push(`/scanning-details?${currentParams.toString()}`);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-4xl overflow-hidden">
                    <div className="bg-[#62a07b] p-8 text-center relative">
                        <button
                            onClick={onClose}
                            className="absolute cursor-pointer top-4 right-4 text-white hover:opacity-80"
                        >
                            <IoClose size={24} />
                        </button>
                        <h2 className="text-white text-3xl font-bold mb-4">GLÜCKWUNSCH!</h2>
                        <p className="text-white text-lg">
                            Ihr Fußscan ist abgeschlossen. Fahren Sie jetzt fort, um die perfekten Schuhe für Sie zu finden und von unserer individuellen Beratung zu profitieren.
                        </p>
                    </div>
                    <div className="p-8 text-center">
                        <h3 className="text-xl font-bold mb-2">PROFITIEREN SIE JETZT VON UNSERER APP!</h3>
                        <p className="text-gray-600 mb-6">Passende Schuhe - immer Griffbereit!</p>

                        {/* QR Code */}
                        <div className="flex justify-center mb-6">
                            <Image
                                src={qrCode}
                                alt="QR Code"
                                width={200}
                                height={200}
                            />
                        </div>
                        <button
                            onClick={handleClose}
                            className="bg-[#62a07b] cursor-pointer text-white px-12 py-3 rounded-md hover:bg-opacity-90 transition-all"
                        >
                            FORTFAHREN
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
                    <ScanningLoading />
                </div>
            )}
        </>
    );
}