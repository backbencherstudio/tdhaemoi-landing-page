import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import bannerImg from '../../public/banner/banner.png'
import logo from '../../public/banner/logo.png'

export default function Home() {
  return (
    <div className="flex justify-center">
      <div className="w-[1440px] relative">
        {/* Blurred background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImg}
            alt="Background blur"
            width={1440}
            height={600}
            className="object-cover blur-md"
          />
        </div>
        {/* Main sharp image */}
        <div className="relative z-10">
          <Image
            src={bannerImg}
            alt="Hiking boot in mountainous terrain"
            width={1440}
            height={600}
            className="object-cover"
          />
          {/* Logo overlay */}
          <div className="absolute top-4 right-4 z-20">
            <Link href='/'>
              <Image
                src={logo}
                alt="Company logo"
                width={200}
                height={150}
                className="object-contain w-[170px] h-[200px]"
              />
            </Link>
          </div>
        </div>
        <div className="relative z-20 bg-black bg-opacity-90 py-6 text-center">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">
            FINDE DEINEN PERFEKT PASSENDEN SCHUH!
          </h2>
          <Link href="/shoes">
            <button className="bg-[#62a07c] cursor-pointer transform duration-300 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
              JETZT STARTEN
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}