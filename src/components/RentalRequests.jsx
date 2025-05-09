import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RentalRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRentalRequests();
  }, []);

  const fetchRentalRequests = async () => {
    try {
      const response = await api.get('/rental-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching rental requests:', error);
    }
  };

  const handleRequest = async (requestId, status) => {
    try {
      await api.put(`/rental-requests/${requestId}`, { status });
      // Enviar notificación al cliente
      await api.post('/notifications', {
        userId: requests.find(r => r.id === requestId).clientId,
        message: status === 'approved' 
          ? 'Su solicitud de alquiler ha sido aprobada. Por favor, proceda con el pago.'
          : 'Su solicitud de alquiler ha sido rechazada.',
        type: status === 'approved' ? 'success' : 'rejection'
      });
      fetchRentalRequests();
    } catch (error) {
      console.error('Error handling request:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bodega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{request.clientName}</div>
                  <div className="text-sm text-gray-500">{request.clientEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{request.warehouseName}</div>
                  <div className="text-sm text-gray-500">#{request.warehouseId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(request.requestDate).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRequest(request.id, 'approved')}
                      className="text-green-600 hover:text-green-900 bg-green-100 px-3 py-1 rounded"
                      disabled={request.status !== 'pending'}
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleRequest(request.id, 'rejected')}
                      className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded"
                      disabled={request.status !== 'pending'}
                    >
                      Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalRequests;
