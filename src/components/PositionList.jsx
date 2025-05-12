import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PositionList = ({ sectorId }) => {
  const [positions, setPositions] = useState([]);
  const [newPos, setNewPos] = useState({ descripcion: '', fila: '', columna: '', largo: '', ancho: '', alto: '' });

  const fetchPositions = async () => {
    try {
      const { data } = await api.get(`/puestos/sector/${sectorId}`);
      setPositions(data);
    } catch (err) {
      console.error('Error fetching positions:', err);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [sectorId]);

  const handleAddPosition = async () => {
    try {
      await api.post('/puestos', {
        ...newPos,
        idSector: sectorId,
        fila: parseInt(newPos.fila),
        columna: parseInt(newPos.columna),
        largo: parseFloat(newPos.largo),
        ancho: parseFloat(newPos.ancho),
        alto: parseFloat(newPos.alto)
      });
      setNewPos({ descripcion: '', fila: '', columna: '', largo: '', ancho: '', alto: '' });
      fetchPositions();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al añadir puesto');
    }
  };

  return (
    <div className="mt-3">
      <h5 className="font-semibold mb-1">Puestos</h5>
      {positions.length === 0
        ? <p className="text-gray-500">Sin puestos aún.</p>
        : positions.map(p => (
            <div key={p.id} className="text-sm mb-1">
              {p.descripcion} (Fila {p.fila}, Col {p.columna})
            </div>
          ))
      }

      <div className="mt-2 grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Descripción"
          value={newPos.descripcion}
          onChange={e => setNewPos(prev => ({ ...prev, descripcion: e.target.value }))}
          className="border rounded p-1 col-span-2"
        />
        <input
          type="number"
          placeholder="Fila"
          value={newPos.fila}
          onChange={e => setNewPos(prev => ({ ...prev, fila: e.target.value }))}
          className="border rounded p-1 w-16"
        />
        <input
          type="number"
          placeholder="Col"
          value={newPos.columna}
          onChange={e => setNewPos(prev => ({ ...prev, columna: e.target.value }))}
          className="border rounded p-1 w-16"
        />
        {['largo','ancho','alto'].map(dim => (
          <input
            key={dim}
            type="number"
            placeholder={dim}
            value={newPos[dim]}
            onChange={e => setNewPos(prev => ({ ...prev, [dim]: e.target.value }))}
            className="border rounded p-1 w-full"
          />
        ))}
      </div>
      <button
        onClick={handleAddPosition}
        className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Añadir Puesto
      </button>
    </div>
  );
};

export default PositionList;
