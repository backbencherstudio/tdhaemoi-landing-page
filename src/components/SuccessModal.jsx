import React, { useState } from 'react';
import Image from 'next/image';
import { IoClose } from "react-icons/io5";
import qrCode from '../../public/qrscanner.png';
import ScanningLoading from './loading/ScanningLoading';
import { useRouter, useSearchParams } from 'next/navigation';
import ScanningDetailsModal from './ScanningDetailsModal';

export default function SuccessModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl transform animate-fadeIn">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-[#62a07b]/10 rounded-full mx-auto flex items-center justify-center">
                            <svg className="w-12 h-12 text-[#62a07b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h2 className="text-2xl font-bold text-[#62a07b] mb-4">
                        GLÜCKWUNSCH!
                    </h2>
                    <p className="text-xl text-gray-700 mb-8">
                        IHR FUSSSCAN IST ABGESCHLOSSEN!
                    </p>
                    <p className="text-gray-600 mb-8">
                        Fahren Sie fort und lassen Sie unsere Technologie die perfekte Passform für Ihren Schuh ermitteln.
                    </p>

                    {/* Continue Button */}
                    <button
                        onClick={onClose}
                        className="bg-[#62a07b] hover:bg-[#528c68] text-white px-10 py-3 rounded-full
                            text-lg font-semibold shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                    >
                        Fortfahren
                    </button>
                </div>
            </div>
        </div>
    );
}