import React from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { authService } from '../services/authService';
import Swal from 'sweetalert2';

const UserInfo = ({ username = "Usuario", role = "" }) => {
  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: "¿Estás seguro de que deseas salir?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await authService.logout();
      }
    } catch (error) {
      // En caso de error, forzar el cierre de sesión
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#C4DDFF] rounded-lg p-4 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="bg-[#7FB3FA] rounded-full p-3">
          <FaUser className="text-white text-xl" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800 text-lg">{username}</h2>
          <p className="text-gray-600 capitalize">{role}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-[#7FB3FA] hover:bg-[#5A8DD6] text-white p-2 rounded-full transition-colors cursor-pointer"
          title="Cerrar sesión"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
