import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BodegaManager = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [bodegas, setBodegas] = useState([]);

  const fetchBodegas = async () => {
    try {
      const response = await axios.get('/api/bodegas');
      setBodegas(response.data);
    } catch (error) {
      console.error('Error al obtener bodegas:', error);
    }
  };

  useEffect(() => {
    fetchBodegas();
  }, []);

  const handleCrear = async () => {
    try {
      await axios.post('/api/bodegas', { nombre, descripcion });
      setNombre('');
      setDescripcion('');
      fetchBodegas();
    } catch (error) {
      console.error('Error al crear bodega:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario de creación */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Nombre de la bodega"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleCrear}
          className="bg-[#DAEBFE] hover:bg-blue-300 text-blue-900 font-semibold px-6 py-3 rounded-lg transition"
        >
          Crear Bodega
        </button>
      </div>

      {/* Lista de bodegas */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
        <h3 className="text-lg font-bold mb-4">Bodegas Registradas</h3>
        <ul className="space-y-3">
          {bodegas.map((bodega) => (
            <li
              key={bodega.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg border"
            >
              <div>
                <p className="font-semibold text-blue-800">{bodega.nombre}</p>
                <p className="text-sm text-gray-600">{bodega.descripcion}</p>
              </div>
              {/* Aquí puedes añadir botones de editar/eliminar más adelante */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BodegaManager;
