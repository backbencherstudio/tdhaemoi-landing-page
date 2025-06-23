import Navbar from '../../../components/Navbar/Navbar';
import Sidebar from '../../../components/Sidebar/Sidebar';
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full">
        <div className="flex-1 flex flex-col lg:flex-row mt-5 gap-10 lg:gap-5">
          <div className="w-full lg:w-80 mx-auto flex-shrink-0">

            <Sidebar />
          </div>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}