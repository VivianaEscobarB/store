import React, { useEffect, useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import api from '../services/api';
import WarehouseModal from './WarehouseModal';

const WarehouseManager = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/bodegas');
      setWarehouses(response.data || []);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
      setError('Hubo un error al cargar las bodegas.');
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const handleWarehouseClick = (id) => {
    setSelectedWarehouseId(id);
    setIsModalOpen(true);
  };

  const handleModalOpenChange = (open) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedWarehouseId(null);
      fetchWarehouses();
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Cargando bodegas...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Lista de Bodegas</h2>
      {warehouses.length === 0 ? (
        <p className="text-gray-600">No hay bodegas disponibles.</p>
      ) : (
        <ul className="space-y-3">
          {warehouses.map((warehouse) => (
            <li
              key={warehouse.id}
              onClick={() => handleWarehouseClick(warehouse.id)}
              className="border p-4 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold text-lg text-blue-600">
                {warehouse.descripcion || 'Bodega sin descripción'}
              </h3>
              <p className="text-sm text-gray-600">
                Tipo: {warehouse.tipoBodega?.nombre || 'No especificado'}
              </p>
              <p className="text-xs text-gray-500">
                Ciudad: {warehouse.ciudad?.nombre || 'No especificada'}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Dialog.Root open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-2xl max-h-[85vh] transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl focus:outline-none data-[state=open]:animate-contentShow overflow-y-auto">
            {selectedWarehouseId && (
              <WarehouseModal
                warehouseId={selectedWarehouseId}
                onClose={() => handleModalOpenChange(false)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default WarehouseManager;
