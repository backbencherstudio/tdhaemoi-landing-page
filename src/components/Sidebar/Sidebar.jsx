'use client'
import React, { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

export default function Sidebar() {
  const [openSections, setOpenSections] = useState({
    schuhtyp: false,
    geschlecht: false,
    marken: false,
    grosse: false,
    feetFirstFit: false,
    farbe: false,
    preis: false,
    verfugbarkeit: false,
    angebote: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...Object.fromEntries(Object.keys(prev).map(key => [key, false])),
      [section]: !prev[section]
    }));
  };

  const filterSections = [
    { id: 'schuhtyp', label: 'Schuhtyp' },
    { id: 'geschlecht', label: 'Geschlecht' },
    { id: 'marken', label: 'Marken' },
    { id: 'grosse', label: 'Größe' },
    { id: 'feetFirstFit', label: 'FeetF1rst Fit' },
    { id: 'farbe', label: 'Farbe' },
    { id: 'preis', label: 'Preis' },
    { id: 'verfugbarkeit', label: 'Verfügbarkeit' },
    { id: 'angebote', label: 'Angebote' }
  ];

  return (
    <div className="w-full lg:w-80 bg-white shadow-sm rounded-xl sticky top-36">
     
      <div className="p-4">
        {filterSections.map((section) => (
          <div key={section.id} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-pathway-extreme text-sm font-semibold">{section.label}</span>
              <IoIosArrowDown
                className={`transform transition-transform duration-200 ${openSections[section.id] ? 'rotate-180' : ''
                  }`}
              />
            </button>
            {openSections[section.id] && (
              <div className="py-2 px-4">
                {/* Content for each section will go here */}
                <div className="space-y-2">
                  {/* Example filter options - customize based on section */}
                  <div className="text-sm text-gray-600 ">Filter options for {section.label}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
