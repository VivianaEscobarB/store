import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

function CloseSection({ username }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaChevronDown className="ml-1" />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 bg-white hover:bg-red-500 hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => {
              alert('Cerrando sesión');
              console.log('Cerrar sesión');
              setIsMenuOpen(false);
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default CloseSection;