import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const UserInfo = ({ username }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cierra el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log('Sesión cerrada');
    setIsMenuOpen(false); // Cierra el menú después de cerrar sesión
  };

  return (
    <div className="relative bg-[#2F855A] text-white p-2 rounded-md shadow-md w-[84%] ml-[10px]">
      <div className="flex justify-between items-center">
        <span className="block text-sm font-bold">{username}</span>
        <button
          className="flex items-center text-white hover:text-gray-200 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaChevronDown />
        </button>
      </div>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-0 right-[-12rem] w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <button
            className="cursor-pointer block w-full text-left px-4 py-1.5 text-gray-700 hover:bg-red-500 hover:text-white rounded-lg"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
