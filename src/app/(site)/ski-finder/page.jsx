'use client'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function SkiFinder() {
  const data = [

    {
      id: 1,
      category: 'reservierung abholen',
      title: 'RESERVIERUNG ABHOLEN',
      image: '/skiVerleih/Reservierungabholen.jpg',
      link: '/reservierung-abholen',
    },
    {
      id: 2,
      category: 'neueAusleiheStarten',
      title: 'NEUE AUSLEIHE STARTEN',
      image: '/skiVerleih/NeueAusleiheStarten.jpg',
      link: '/ski-finder/neue-ausleihe-starten',
    }
  ]
  return (
    <div className="flex flex-col md:flex-row h-screen w-full relative gap-2">
      {data.map((item, index) => (
        <Link
          href={item.link}
          key={item.id}
          className="flex-1 relative group overflow-hidden"
        >
          <div
            style={{ backgroundImage: `url(${item.image})` }}
            className={`h-full w-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105
                            ${index === 1 ? "" : ""}`}
          >
            <div className="absolute inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4">
              <h2 className="text-white text-2xl lg:text-4xl font-semibold  text-center">
                {item.title}
              </h2>
            </div>
          </div>
        </Link>
      ))}

    </div>
  )
}
