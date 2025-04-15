'use client'
import React from 'react'
import { FiMenu } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="text-gray-600 hover:text-gray-800 md:hidden"
        >
          <FiMenu className="h-6 w-6" />
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex items-center">
          {user && (
            <div className="relative h-12 w-12 rounded-full ">
              <Image
                src={user.image}
                alt={user.name}
                width={100}
                height={100}
                className="rounded-full object-cover h-full w-full"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
