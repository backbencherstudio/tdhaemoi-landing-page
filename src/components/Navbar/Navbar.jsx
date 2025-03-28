'use client'
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import logo from '../../../public/navbar/logo.png';
import { LuArrowLeft } from "react-icons/lu";
import { FaApple } from "react-icons/fa";
import { BsAndroid2 } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleBackClick = () => {
        router.back();
    };

    return (
        <nav className=" py-2 bg-black w-full sticky top-0 z-40">
            <div className="flex items-center justify-between px-4 py-2 bg-black w-full ">
                {/* Back button */}
                <div className="w-10">
                    <button 
                        onClick={handleBackClick}
                        className="text-white cursor-pointer bg-black rounded-full border border-white lg:w-10 lg:h-10 w-8 h-8 flex items-center justify-center"
                    >
                        <LuArrowLeft className='text-white text-2xl' />
                    </button>
                </div>

                {/* Center logo */}
                <div className="flex-1 flex justify-center">
                    <Image src={logo} alt="logo" width={500} height={40} className='lg:w-[90px] lg:h-[110px] w-[70px] h-[80px]' />
                </div>

                {/* Right side icons with labels */}
                <div className="flex items-center gap-10 ">
                    <div className="flex flex-col items-center">
                        <FaApple className='text-white text-4xl' />
                        <span className="text-white text-xs font-pathway-extreme mt-2">iOS Zugriff</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <BsAndroid2 className='text-white text-4xl' />
                        <span className="text-white text-xs font-pathway-extreme mt-2">App Zugriff</span>
                    </div>

                    <div className="flex flex-col items-center relative" ref={searchRef}>
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <FiSearch className='text-white text-4xl cursor-pointer' />
                            <span className="text-white text-xs font-pathway-extreme mt-2">Suchen</span>
                        </button>
                        
                        {isSearchOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 transition-all duration-300 ease-in-out transform">
                                <input
                                    type="text"
                                    placeholder="Suchen..."
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white shadow-lg"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}