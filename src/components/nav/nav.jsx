import React from 'react';


export default function Nav() {
    return (
        <div className='mt-5 flex justify-between items-center'>
            <h1 className="text-3xl font-bold mb-4">Herren Laufschuhe</h1>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 max-w-md">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
                />
            </div>
        </div>
    );
}
