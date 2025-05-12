import React, { useState } from 'react';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

const CreateCollaborators = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'Juan Pérez', role: 'Administrador' },
    { id: 2, name: 'María López', role: 'Vendedor' },
    { id: 3, name: 'Carlos García', role: 'Bodeguero' },
  ]);
  const [newCollaborator, setNewCollaborator] = useState({ name: '', role: '' });

  const filteredCollaborators = collaborators.filter((collaborator) =>
    collaborator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCollaborator({ name: '', role: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCollaborator({ ...newCollaborator, [name]: value });
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!newCollaborator.name.trim() || !newCollaborator.role) return;

    const newId = collaborators.length + 1;
    setCollaborators([...collaborators, { ...newCollaborator, id: newId }]);
    handleCloseModal();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <h2 className="text-2xl font-semibold text-gray-700 flex-shrink-0">Gestión de Colaboradores</h2>
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
          className="bg-[#D1BBFF] text-white px-4 py-2 rounded-md hover:bg-[#BFA3E6] transition w-full md:w-auto"
          onClick={handleAddUser}
        >
          <div className="flex items-center gap-2 justify-center">
            <FaUserPlus /> Añadir
          </div>
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Lista de Colaboradores</h3>
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Rol</th>
            </tr>
          </thead>
          <tbody>
            {filteredCollaborators.length > 0 ? (
              filteredCollaborators.map((collaborator) => (
                <tr key={collaborator.id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm">{collaborator.id}</td>
                  <td className="p-3 text-sm">{collaborator.name}</td>
                  <td className="p-3 text-sm">{collaborator.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No se encontraron colaboradores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Registrar nuevo colaborador</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSaveUser}>
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={newCollaborator.name}
                onChange={handleInputChange}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-violet-300"
              />
              <select
                name="role"
                value={newCollaborator.role}
                onChange={handleInputChange}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-violet-300"
              >
                <option value="">Selecciona un rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Bodeguero">Bodeguero</option>
              </select>

              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-[#D1BBFF] text-white px-4 py-2 rounded-md hover:bg-[#BFA3E6] transition-colors"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
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
