import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importa los iconos

const MenuModify = ({ onEdit, onDelete }) => { // Cambiado de ProductRowMenu a MenuModify
  return (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="text-blue-500 hover:text-blue-700"
        title="Editar"
      >
        <FaEdit />
      </button>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700"
        title="Eliminar"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default MenuModify; // Cambiado de ProductRowMenu a MenuModify
