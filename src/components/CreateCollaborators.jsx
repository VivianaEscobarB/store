import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const CreateCollaborators = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'Juan Pérez', role: 'Administrador' },
    { id: 2, name: 'María López', role: 'Vendedor' },
    { id: 3, name: 'Carlos García', role: 'Bodeguero' },
  ]);
  const [newCollaborator, setNewCollaborator] = useState({ id: '', name: '', role: '' }); // Estado para el nuevo usuario

  const filteredCollaborators = collaborators.filter((collaborator) =>
    collaborator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setIsModalOpen(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal
    setNewCollaborator({ id: '', name: '', role: '' }); // Limpia el formulario
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCollaborator({ ...newCollaborator, [name]: value }); // Actualiza los datos del nuevo usuario
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    setCollaborators([...collaborators, newCollaborator]); // Agrega el nuevo usuario a la lista
    handleCloseModal(); // Cierra el modal
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera con campo de búsqueda */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <h2 className="text-xl font-bold text-gray-700 flex-shrink-0">Gestión de Colaboradores</h2>
        <div className="flex items-center w-full bg-white border border-gray-300 rounded-md shadow-sm">
          <span className="p-3 text-gray-500">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Buscar colaboradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 focus:outline-none bg-transparent"
          />
        </div>
        <button
          className="bg-[#D1BBFF] text-white px-4 py-2 rounded-md hover:bg-[#BFA3E6] transition-colors w-full md:w-auto cursor-pointer"
          onClick={() => console.log('Buscar:', searchTerm)}
        >
          Buscar
        </button>
      </div>

      {/* Tabla de colaboradores */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Lista de Colaboradores</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">ID</th>
              <th className="border border-gray-300 p-2 text-left">Nombre</th>
              <th className="border border-gray-300 p-2 text-left">Rol</th>
            </tr>
          </thead>
          <tbody>
            {filteredCollaborators.length > 0 ? (
              filteredCollaborators.map((collaborator) => (
                <tr key={collaborator.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{collaborator.id}</td>
                  <td className="border border-gray-300 p-2">{collaborator.name}</td>
                  <td className="border border-gray-300 p-2">{collaborator.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No se encontraron colaboradores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Botones Añadir y Cancelar */}
        <div className="mt-4 flex justify-end gap-4">
          <button
            className="bg-[#D1BBFF] text-white px-4 py-2 rounded-md hover:bg-[#BFA3E6] transition-colors cursor-pointer"
            onClick={handleAddUser} // Abre el modal
          >
            Añadir
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
            onClick={() => console.log('Cancelar acción')}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal para agregar usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-100/90 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Agregar Nuevo Usuario</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSaveUser}>
              <input
                type="text"
                name="id"
                placeholder="Identificación del usuario"
                value={newCollaborator.id}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <input
                type="text"
                name="name"
                placeholder="Nombre del usuario"
                value={newCollaborator.name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <input
                type="text"
                name="role"
                placeholder="Rol del usuario"
                value={newCollaborator.role}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-[#D1BBFF] text-white px-4 py-2 rounded-md hover:bg-[#BFA3E6] transition-colors cursor-pointer"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCollaborators;
