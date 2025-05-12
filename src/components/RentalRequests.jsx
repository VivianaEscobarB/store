import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaSyncAlt, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../services/api';

const RentalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener solicitudes de alquiler
  const fetchRentalRequests = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await api.get('/contratos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const formattedRequests = response.data.map(contrato => ({
        id: contrato.id,
        clientName: contrato.cliente?.nombre || 'No especificado',
        warehouseName: contrato.bodega?.descripcion || 'N/A',
        startDate: contrato.fechaInicio,
        endDate: contrato.fechaFin,
        status: contrato.status,
        price: contrato.precioTotal || 0
      }));
      
      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar aprobación/rechazo
  const handleStatusChange = async (id, status) => {
    try {
      const token = sessionStorage.getItem('token');
      await api.put(`/contratos/${id}`, { status }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Enviar notificación
      const request = requests.find(r => r.id === id);
      await api.post('/notifications', {
        userId: request.clientId,
        message: `Su solicitud para ${request.warehouseName} ha sido ${status === 'Aprobado' ? 'aprobada' : 'rechazada'}`,
        type: 'contract-update'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      Swal.fire('Éxito', `Solicitud ${status === 'Aprobado' ? 'aprobada' : 'rechazada'}`, 'success');
      fetchRentalRequests();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Swal.fire('Error', 'No se pudo actualizar la solicitud', 'error');
    }
  };

  // Filtrar solicitudes
  const filteredRequests = requests.filter(request => 
    request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.warehouseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear fecha
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('es-ES') : 'N/A';
  };

  useEffect(() => {
    fetchRentalRequests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Solicitudes de Alquiler</h1>
        <button 
          onClick={fetchRentalRequests} 
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          disabled={isLoading}
        >
          <FaSyncAlt className={isLoading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <div className="flex items-center border rounded-lg px-3 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar por cliente o bodega..."
            className="w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bodega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  Cargando...
                </td>
              </tr>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{request.clientName}</td>
                  <td className="px-6 py-4">{request.warehouseName}</td>
                  <td className="px-6 py-4">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.status === 'Aprobado' ? 'bg-green-100 text-green-800' :
                      request.status === 'Rechazado' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      <FaEye />
                    </button>
                    {request.status === 'Pendiente' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(request.id, 'Aprobado')}
                          className="text-green-500 hover:text-green-700 cursor-pointer"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(request.id, 'Rechazado')}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No se encontraron solicitudes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Detalles de la Solicitud</h2>
            
            <div className="space-y-3">
              <div>
                <p className="font-semibold">Cliente:</p>
                <p>{selectedRequest.clientName}</p>
              </div>
              <div>
                <p className="font-semibold">Bodega:</p>
                <p>{selectedRequest.warehouseName}</p>
              </div>
              <div>
                <p className="font-semibold">Período:</p>
                <p>{formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}</p>
              </div>
              <div>
                <p className="font-semibold">Precio:</p>
                <p>${selectedRequest.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold">Estado:</p>
                <p>{selectedRequest.status}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalRequests;