import React from 'react';

export default function Home() {
  return (
    <>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example product card - Repeat this structure for each product */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="aspect-square relative mb-4">
            {/* Add product image here */}
          </div>
          <div className="space-y-2">
            <h3 className="font-pathway-extreme font-semibold">Dynafit</h3>
            <p className="text-gray-600">Laufschuhe - Herren</p>
            <p className="font-semibold">199,99€</p>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                90% FIT
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
