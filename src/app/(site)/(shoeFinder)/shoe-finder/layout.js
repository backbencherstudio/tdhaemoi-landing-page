
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="">
      <div className="flex min-h-[calc(100vh-100px)] bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">

          <main className="p-6">
            <Navbar />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
