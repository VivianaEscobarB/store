import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MovementReport = () => {
  const [activeWarehouses, setActiveWarehouses] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseContracts, setWarehouseContracts] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error en formato de fecha';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Aprobado':
        return 'text-green-500 font-bold';
      case 'Pendiente':
        return 'text-yellow-400 font-bold';
      case 'Rechazado':
        return 'text-red-500 font-bold';
      default:
        return '';
    }
  };

  const fetchWarehouseContracts = async () => {
    try {
      const response = await api.get('/contratos');
      if (response.data) {
        const approvedContracts = response.data.filter(contrato => contrato.status === 'Aprobado');
        const formattedContracts = approvedContracts.map(contrato => ({
          id: contrato.id,
          warehouse: contrato.bodega?.descripcion || 'N/A',
          city: contrato.bodega?.ciudad || 'N/A',
          rentalPeriod: `${formatDate(contrato.fechaInicio)} - ${formatDate(contrato.fechaFin)}`,
          price: contrato.precioTotal || 0,
          status: contrato.status,
          ...contrato,
        }));
        setWarehouseContracts(formattedContracts);
      } else {
        setWarehouseContracts([]);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setWarehouseContracts([]);
    }
  };

  const fetchActiveWarehouses = async () => {
    try {
      const response = await api.get('/bodegas');
      setActiveWarehouses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching active warehouses:', error);
      setLoading(false);
      Swal.fire('Error', 'No se pudieron cargar las bodegas activas', 'error');
    }
  };

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
      } else {
        setMovements([]);
      }
    };
    fetchMovements();
  }, [selectedWarehouse]);

  useEffect(() => {
    fetchActiveWarehouses();
    fetchWarehouseContracts();
  }, []);

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

  if (loading) {
    return <div className="p-6">Cargando información...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-[#FFFFFF] rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Reporte de Movimientos</h2>

      {/* Tabla de Bodegas Contratadas (Reemplaza la tabla de bodegas activas) */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Bodegas Contratadas</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bodega</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {warehouseContracts.length > 0 ? (
                warehouseContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedWarehouse?.id === contract.bodega?.id ? 'bg-blue-50 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedWarehouse(contract.bodega)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contract.warehouse}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.rentalPeriod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${contract.price?.toLocaleString()}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusStyle(contract.status)}`}>
                      {contract.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No hay bodegas contratadas actualmente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de movimientos */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Movimientos de la bodega seleccionada</h3>
          <div className="space-x-2">
            <button
              onClick={() => handleRequestMovement('entrada')}
              className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200 ${!selectedWarehouse && 'opacity-50 cursor-not-allowed'}`}
              disabled={!selectedWarehouse}
            >
              <FaPlus className="inline mr-2" /> Solicitar entrada
            </button>
            <button
              onClick={() => handleRequestMovement('salida')}
              className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200 ${!selectedWarehouse && 'opacity-50 cursor-not-allowed'}`}
              disabled={!selectedWarehouse}
            >
              <FaMinus className="inline mr-2" /> Solicitar salida
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.length > 0 ? (
                movements.map((movement, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(movement.fecha)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        movement.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {movement.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movement.producto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.cantidad}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        movement.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        movement.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {movement.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{movement.observaciones}</td>
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