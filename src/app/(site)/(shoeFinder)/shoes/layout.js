
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full pb-10">
        <div className="flex-1 flex flex-col md:flex-row mt-5">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className='p-4 '>
              <div className=' flex items-center gap-2'>
                <h1 className="text-xl font-bold ">Herren Laufschuhe
                </h1>
                <IoIosArrowDown className='text-2xl' />
              </div>
            </div>
            <Sidebar />
          </div>
          <main className="flex-1 px-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
