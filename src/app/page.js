import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import bannerImg from '../../public/banner/banner.png'
import logo from '../../public/banner/logo.png'

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Blurred background image */}
      <div className="absolute inset-0">
        <Image
          src={bannerImg}
          alt="Background blur"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover blur-md"
          quality={100}
        />
      </div>
      {/* Main sharp image */}
      <div className="relative h-screen">
        <Image
          src={bannerImg}
          alt="Hiking boot in mountainous terrain"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover"
          quality={100}
        />
        {/* Logo overlay */}
        <div className="absolute top-4 right-4 z-20">
          <Link href='/'>
            <Image
              src={logo}
              alt="Company logo"
              width={200}
              height={150}
              className="w-[80px] h-[140px] md:w-[100px] md:h-[160px] lg:w-[150px] lg:h-[190px] object-contain"
            />
          </Link>
        </div>
        {/* Button section */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black bg-opacity-90 py-4 md:py-6 text-center">
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4 px-4">
            FINDE DEINEN PERFEKT PASSENDEN SCHUH!
          </h2>
          <Link href="/categories">
            <button className="bg-[#62a07c] cursor-pointer transform duration-300 text-white px-4 md:px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
              JETZT STARTEN
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}