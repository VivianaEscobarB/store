import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MovementReport = () => {
  const [activeWarehouses, setActiveWarehouses] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [cities, setCities] = useState([]);

  // Obtener bodegas activas del cliente
  useEffect(() => {
    const fetchActiveWarehouses = async () => {
      try {
        const response = await api.get('/contratos/activos');
        setActiveWarehouses(response.data);
        const uniqueCities = [...new Set(response.data.map(w => w.ciudad?.nombre || 'No especificada'))];
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error al obtener bodegas activas:', error);
        setActiveWarehouses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveWarehouses();
  }, []);

  // Obtener movimientos cuando se selecciona una bodega
  useEffect(() => {
    const fetchMovements = async () => {
      if (selectedWarehouse) {
        try {
          const response = await api.get(`/movimientos/${selectedWarehouse.id}`);
          setMovements(response.data);
        } catch (error) {
          console.error('Error al obtener movimientos:', error);
          setMovements([]);
        }
      }
    };
    fetchMovements();
  }, [selectedWarehouse]);

  const handleRequestMovement = (type) => {
    if (!selectedWarehouse) {
      Swal.fire('Error', 'Debe seleccionar una bodega', 'error');
      return;
    }

    Swal.fire({
      title: `Solicitar ${type === 'entrada' ? 'entrada' : 'salida'} de productos`,
      html: `
        <input id="producto" class="swal2-input" placeholder="Nombre del producto">
        <input id="cantidad" type="number" class="swal2-input" placeholder="Cantidad">
        <textarea id="observaciones" class="swal2-textarea" placeholder="Observaciones"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Enviar solicitud',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const producto = Swal.getPopup().querySelector('#producto').value;
        const cantidad = Swal.getPopup().querySelector('#cantidad').value;
        const observaciones = Swal.getPopup().querySelector('#observaciones').value;
        if (!producto || !cantidad) {
          Swal.showValidationMessage('Por favor complete todos los campos');
        }
        return { producto, cantidad, observaciones };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmitMovement(type, result.value);
      }
    });
  };

  const handleSubmitMovement = async (type, data) => {
    try {
      await api.post('/movimientos/solicitud', {
        tipo: type,
        bodegaId: selectedWarehouse.id,
        ...data
      });
      Swal.fire('Éxito', 'Solicitud enviada correctamente', 'success');
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      Swal.fire('Error', 'No se pudo enviar la solicitud', 'error');
    }
  };

  const filteredWarehouses = activeWarehouses.filter(warehouse => 
    filter === 'todos' || warehouse.ciudad?.nombre === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Mis Bodegas Activas</h2>
        <select
          className="p-2 border rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="todos">Todas las ciudades</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Lista de bodegas activas - Siempre visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWarehouses.length > 0 ? (
          filteredWarehouses.map((warehouse, index) => (
            <div 
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedWarehouse?.id === warehouse.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedWarehouse(warehouse)}
            >
              <h3 className="font-bold">{warehouse.descripcion}</h3>
              <p className="text-gray-600">Ciudad: {warehouse.ciudad?.nombre || 'No especificada'}</p>
              <p className="text-gray-600">Tipo: {warehouse.tipoBodega?.nombre}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No hay bodegas activas disponibles</p>
          </div>
        )}
      </div>

      {/* Tabla de movimientos - Siempre visible */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Movimientos de la bodega</h3>
          <div className="space-x-2">
            <button
              onClick={() => handleRequestMovement('entrada')}
              className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ${!selectedWarehouse && 'opacity-50 cursor-not-allowed'}`}
              disabled={!selectedWarehouse}
            >
              <FaPlus className="inline mr-2" /> Solicitar entrada
            </button>
            <button
              onClick={() => handleRequestMovement('salida')}
              className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ${!selectedWarehouse && 'opacity-50 cursor-not-allowed'}`}
              disabled={!selectedWarehouse}
            >
              <FaMinus className="inline mr-2" /> Solicitar salida
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Tipo</th>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Cantidad</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.length > 0 ? (
                movements.map((movement, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(movement.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        movement.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {movement.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4">{movement.producto}</td>
                    <td className="px-6 py-4">{movement.cantidad}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        movement.estado === 'completado' ? 'bg-green-100 text-green-800' : 
                        movement.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {movement.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">{movement.observaciones}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    {selectedWarehouse ? 
                      'No hay movimientos registrados para esta bodega' : 
                      'Seleccione una bodega para ver sus movimientos'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MovementReport;
