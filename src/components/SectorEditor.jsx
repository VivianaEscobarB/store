import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PositionList from './PositionList';

const SectorEditor = ({ warehouseId, warehouseDimensions }) => {
  const [sectors, setSectors] = useState([]);
  const [newSector, setNewSector] = useState({ nombre: '', largo: '', ancho: '', alto: '' });
  const [sectorErrors, setSectorErrors] = useState({});

  useEffect(() => {
    fetchSectors();
  }, [warehouseId]);

  const fetchSectors = async () => {
    try {
      const response = await api.get(`/bodegas/${warehouseId}/sectores`);
      setSectors(response.data);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  const handleAddSector = async () => {
    const errors = {};
    if (!newSector.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!newSector.largo) errors.largo = 'El largo es requerido';
    if (!newSector.ancho) errors.ancho = 'El ancho es requerido';
    if (!newSector.alto) errors.alto = 'El alto es requerido';

    if (Object.keys(errors).length > 0) {
      setSectorErrors(errors);
      return;
    }
    setSectorErrors({});

    if (warehouseDimensions) {
      const totalSectorArea = sectors.reduce((sum, sector) => sum + (sector.dimensiones?.largo * sector.dimensiones?.ancho * sector.dimensiones?.alto || 0), 0);
      const newSectorVolume = parseFloat(newSector.largo) * parseFloat(newSector.ancho) * parseFloat(newSector.alto);
      const warehouseVolume = parseFloat(warehouseDimensions.largo) * parseFloat(warehouseDimensions.ancho) * parseFloat(warehouseDimensions.alto);

      if (totalSectorArea + newSectorVolume > warehouseVolume) {
        alert('La suma de las dimensiones de los sectores excede las dimensiones de la bodega.');
        return;
      }
    }

    try {
      await api.post(`/sectores`, {
        nombre: newSector.nombre,
        bodegaId: warehouseId,
        dimensiones: { ...newSector }
      });
      setNewSector({ nombre: '', largo: '', ancho: '', alto: '' });
      fetchSectors();
    } catch (error) {
      console.error('Error adding sector:', error);
    }
  };

  const handleDeleteSector = async (sectorId) => {
    try {
      await api.delete(`/sectores/${sectorId}`);
      fetchSectors();
    } catch (error) {
      console.error('Error deleting sector:', error);
    }
  };

  const handleNewSectorChange = (e) => {
    const { name, value } = e.target;
    setNewSector((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h4 className="font-semibold text-lg mb-2">Sectores</h4>
      <div className="space-y-4">
        {sectors.map((sector) => (
          <div key={sector.id} className="border p-4 rounded shadow-sm bg-gray-100">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h5 className="text-lg font-semibold">{sector.nombre}</h5>
                <p className="text-sm text-gray-600">
                  Dimensiones: {sector.dimensiones?.largo} x {sector.dimensiones?.ancho} x {sector.dimensiones?.alto}
                </p>
              </div>
              <button
                onClick={() => handleDeleteSector(sector.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
            <PositionList sectorId={sector.id} sectorDimensions={sector.dimensiones} />
          </div>
        ))}
      </div>

      <h4 className="font-semibold text-lg mt-6 mb-2">Añadir Nuevo Sector</h4>
      <div className="space-y-2">
        <div>
          <label className="block font-semibold">Nombre:</label>
          <input
            type="text"
            value={newSector.nombre}
            onChange={handleNewSectorChange}
            name="nombre"
            className="border p-2 w-full rounded"
          />
          {sectorErrors.nombre && <p className="text-red-500 text-sm">{sectorErrors.nombre}</p>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block font-semibold">Largo:</label>
            <input
              type="number"
              value={newSector.largo}
              onChange={handleNewSectorChange}
              name="largo"
              className="border p-2 w-full rounded"
            />
            {sectorErrors.largo && <p className="text-red-500 text-sm">{sectorErrors.largo}</p>}
          </div>
          <div>
            <label className="block font-semibold">Ancho:</label>
            <input
              type="number"
              value={newSector.ancho}
              onChange={handleNewSectorChange}
              name="ancho"
              className="border p-2 w-full rounded"
            />
            {sectorErrors.ancho && <p className="text-red-500 text-sm">{sectorErrors.ancho}</p>}
          </div>
          <div>
            <label className="block font-semibold">Alto:</label>
            <input
              type="number"
              value={newSector.alto}
              onChange={handleNewSectorChange}
              name="alto"
              className="border p-2 w-full rounded"
            />
            {sectorErrors.alto && <p className="text-red-500 text-sm">{sectorErrors.alto}</p>}
          </div>
        </div>
        <button onClick={handleAddSector} className="bg-green-500 text-white px-4 py-2 rounded">
          Añadir Sector
        </button>
      </div>
    </div>
  );
};

export default SectorEditor;