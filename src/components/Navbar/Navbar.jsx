import React from 'react';
import Image from 'next/image';
import logo from '../../../public/navbar/logo.png';
import { LuArrowLeft } from "react-icons/lu";
import { FaApple } from "react-icons/fa";
import { BsAndroid2 } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
export default function Navbar() {
    return (
        <nav className=" py-2 bg-black w-full sticky top-0 z-40">
            <div className="flex items-center justify-between px-4 py-2 bg-black w-full container mx-auto">
                {/* Back button */}
                <div className="w-10">
                    <button className="text-white cursor-pointer bg-black rounded-full border border-white lg:w-12 lg:h-12 w-10 h-10 flex items-center justify-center">
                        <LuArrowLeft className='text-white text-3xl' />
                    </button>
                </div>

                {/* Center logo */}
                <div className="flex-1 flex justify-center">
                    <Image src={logo} alt="logo" width={400} height={40} className='lg:w-[70px] lg:h-[80px] w-[50px] h-[60px]' />
                </div>

                {/* Right side icons with labels */}
                <div className="flex items-center gap-10 ">
                    <div className="flex flex-col items-center">
                        <FaApple className='text-white text-5xl' />
                        <span className="text-white text-xs font-pathway-extreme mt-2">iOS Zugriff</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <BsAndroid2 className='text-white text-5xl' />
                        <span className="text-white text-xs font-pathway-extreme mt-2">App Zugriff</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <FiSearch className='text-white text-5xl' />
                        <span className="text-white text-xs font-pathway-extreme mt-2">Suchen</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}