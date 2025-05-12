
import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { FaSearch, FaTrash } from 'react-icons/fa';
import api from '../services/api';

const ContractManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [contracts, setContracts] = useState([]);
  // Actualización del estado del formulario
  const [formData, setFormData] = useState({
    warehouseId: '',
    productType: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [selectedContract, setSelectedContract] = useState(null);
  const [warehouseRequests, setWarehouseRequests] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const searchRef = useRef(null);

  const userName = "Usuario Actual";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredWarehouses([]);
    } else {
      // Filtrar bodegas que no están en proceso de solicitud
      const availableWarehouses = warehouses.filter(warehouse => {
        const isInProcess = warehouseRequests.some(
          request =>
            request.status === 'Pendiente' &&
            request.bodega?.id === warehouse.id
        );
        return !isInProcess && warehouse.descripcion.toLowerCase().includes(value);
      });
      setFilteredWarehouses(availableWarehouses);
    }
  };

  // Manejar el evento de selección de bodegas
  const handleSelectWarehouse = (warehouse) => {
    setSearchTerm(warehouse.descripcion);
    setFilteredWarehouses([]);
    setFormData({
      warehouseId: warehouse.id,
      productType: '',
      rentalPeriod: '',
    });
    setIsModalOpen(true);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setFilteredWarehouses([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchWarehouses();
    fetchWarehouseRequests();
    fetchContratos();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/bodegas');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      Swal.fire('Error', 'No se pudieron cargar las bodegas', 'error');
    }
  };

  const fetchWarehouseRequests = async () => {
    try {
      const response = await api.get('/contratos');
      if (response.data) {
        // Formatear la respuesta para mostrar solo los campos necesarios
        // y agregar la descripción de la bodega
        const formattedRequests = response.data.map(contrato => ({
          id: contrato.id,
          warehouse: contrato.bodega?.descripcion || 'N/A',
          productType: contrato.tipoproducto || 'No especificado',
          rentalPeriod: `${new Date(contrato.fechaInicio).toLocaleDateString()} - ${new Date(contrato.fechaFin).toLocaleDateString()}`,
          requestDate: new Date(contrato.fechaInicio).toLocaleDateString(),
          requester: contrato.cliente?.nombre || 'No especificado',
          status: contrato.status,
          ...contrato
        }));
        setWarehouseRequests(formattedRequests);
      } else {
        setWarehouseRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setWarehouseRequests([]);
    }
  };

  const fetchContratos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('userId');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Obtener todos los contratos
      const contratosResponse = await api.get('/contratos', config);

      if (contratosResponse.data) {
        // Filtrar los contratos por el ID del cliente actual si aplica
        const contratosCliente = contratosResponse.data.filter(contrato =>
          contrato.cliente && contrato.cliente.id === parseInt(userId)
        );
        setContracts(contratosCliente);
      }

    } catch (error) {
      console.error('Error detallado al cargar contratos:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      Swal.fire({
        icon: 'error',
        title: 'Error al cargar contratos',
        text: 'No se pudieron cargar los contratos. Por favor, intente más tarde.'
      });
    }
  };

  // Envío del formulario SIN post a notificaciones
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      Swal.fire('Error', 'La fecha de fin debe ser posterior a la fecha de inicio', 'error');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('userId');
      if (!token) throw new Error('No hay token de autenticación');

      const selectedWarehouse = warehouses.find(wh => wh.id === formData.warehouseId);
      if (!selectedWarehouse) throw new Error('No se encontró la bodega seleccionada');

      const startDate = new Date(formData.fechaInicio);
      const endDate = new Date(formData.fechaFin);
      const daysOfRental = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const dailyPrice = selectedWarehouse.precio || 100;
      // Aumentamos un 10% el precio total:
      const precioTotal = Math.round(daysOfRental * dailyPrice * 1.10);

      const contratoData = {
        bodegaId: Number(formData.warehouseId),
        clienteId: Number(userId),
        tipoproducto: formData.productType,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        precioTotal: precioTotal,
        status: 'Pendiente'
      };

      const response = await api.post('/contratos', contratoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setIsModalOpen(false);
      Swal.fire('Éxito', 'Solicitud enviada correctamente', 'success');

      setFormData({
        warehouseId: '',
        productType: '',
        fechaInicio: '',
        fechaFin: ''
      });
      setSearchTerm('');
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la solicitud', 'error');
    }
  };

  const handleRowClick = (contract) => {
    setSelectedContract(contract);
    setIsDetailModalOpen(true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Detalles del Contrato', 10, 10);
    doc.text(`Cliente: ${selectedContract.clientName}`, 10, 20);
    doc.text(`Producto: ${selectedContract.product}`, 10, 30);
    doc.text(`Fecha Inicio: ${selectedContract.startDate}`, 10, 40);
    doc.text(`Fecha Fin: ${selectedContract.endDate}`, 10, 50);
    doc.text(`Estado: ${selectedContract.status}`, 10, 60);
    doc.save(`Contrato_${selectedContract.clientName}.pdf`);
  };

  const handleSendEmail = () => {
    Swal.fire({
      title: 'Enviar contrato por correo',
      input: 'email',
      inputLabel: 'Correo electrónico',
      inputPlaceholder: 'Ingrese el correo del destinatario',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage('Debe ingresar un correo válido');
        }
        return email;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Enviando contrato a ${result.value}`);
        Swal.fire('Enviado', `El contrato fue enviado a ${result.value}`, 'success');
      }
    });
  };

  const handleDeleteRequest = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la solicitud de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/contratos/request/${id}`);
        await fetchWarehouseRequests();
        Swal.fire('Eliminado', 'La solicitud ha sido eliminada.', 'success');
      } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        Swal.fire('Error',
          error.response?.data?.message || 'No se pudo eliminar la solicitud',
          'error'
        );
      }
    }
  };

  return (
    <div className="p-6 bg-[#FFFFFF] rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Gestión de Contratos</h2>

      <div className="mb-6 relative" ref={searchRef}>
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm p-2 w-full max-w-md">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar bodega por descripción..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 outline-none bg-transparent"
          />
        </div>
        {filteredWarehouses.length > 0 && (
          <ul className="absolute top-full left-0 w-full max-w-md bg-[#FFFFFF] border border-gray-300 rounded-md shadow-lg mt-1 z-10">
            {filteredWarehouses.slice(0, 5).map((warehouse) => {
              const isInProcess = warehouseRequests.some(
                request =>
                  request.status === 'Pendiente' &&
                  request.bodega?.id === warehouse.id
              );

              return (
                <li
                  key={warehouse.id}
                  className={`p-2 ${
                    isInProcess
                      ? 'bg-gray-100 cursor-not-allowed opacity-60'
                      : 'hover:bg-gray-100 cursor-pointer'
                  }`}
                  onClick={() => !isInProcess && handleSelectWarehouse(warehouse)}
                >
                  <div className="font-medium">
                    {warehouse.descripcion}
                    {isInProcess && (
                      <span className="ml-2 text-yellow-600 text-sm">
                        (En proceso de solicitud)
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Dimensiones: {warehouse.largo}x{warehouse.ancho}x{warehouse.alto}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Bodegas Contratadas</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Bodega</th>
              <th className="border border-gray-300 p-2 text-left">Ciudad</th>
              <th className="border border-gray-300 p-2 text-left">Período</th>
              <th className="border border-gray-300 p-2 text-left">Precio</th>
              <th className="border border-gray-300 p-2 text-left">Estado</th>
              <th className="border border-gray-300 p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {warehouseRequests.filter(request => request.status === 'Aprobado').length > 0 ? (
              warehouseRequests
                .filter(request => request.status === 'Aprobado')
                .map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{request.bodega?.descripcion || 'N/A'}</td>
                    <td className="border border-gray-300 p-2">{request.bodega?.ciudad || 'N/A'}</td>
                    <td className="border border-gray-300 p-2">
                      {formatDate(request.fechaInicio)} - {formatDate(request.fechaFin)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      ${request.precioTotal?.toLocaleString() || '0'}
                    </td>
                    <td className={`border border-gray-300 p-2 ${getStatusStyle(request.status)}`}>
                      {request.status}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2 cursor-pointer"
                        onClick={() => handleRowClick(request)}
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No hay bodegas contratadas actualmente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Bodegas Solicitadas</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Bodega</th>
              <th className="border border-gray-300 p-2 text-left">Tipo de Producto</th>
              <th className="border border-gray-300 p-2 text-left">Período de Alquiler</th>
              <th className="border border-gray-300 p-2 text-left">Fecha de Solicitud</th>
              <th className="border border-gray-300 p-2 text-left">Estado</th>
              <th className="border border-gray-300 p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {warehouseRequests.filter(request => request.status === 'Pendiente').length > 0 ? (
              warehouseRequests
                .filter(request => request.status === 'Pendiente')
                .map((request, index) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 relative"
                  >
                    <td className="border border-gray-300 p-2">{request.warehouse}</td>
                    <td className="border border-gray-300 p-2">{request.productType}</td>
                    <td className="border border-gray-300 p-2">{request.rentalPeriod}</td>
                    <td className="border border-gray-300 p-2">{request.requestDate}</td>
                    <td className={`border border-gray-300 p-2 ${getStatusStyle(request.status)}`}>
                      {request.status}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleDeleteRequest(request.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No hay bodegas solicitadas pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Solicitar Contrato</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="clientName"
                placeholder="Nombre del cliente"
                value={formData.clientName}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="product"
                placeholder="Producto solicitado"
                value={formData.product}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Guardar Contrato
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Detalles del Contrato</h3>
            <p><strong>Cliente:</strong> {selectedContract.clientName}</p>
            <p><strong>Producto:</strong> {selectedContract.product}</p>
            <p><strong>Fecha Inicio:</strong> {selectedContract.startDate}</p>
            <p><strong>Fecha Fin:</strong> {selectedContract.endDate}</p>
            <p><strong>Estado:</strong> {selectedContract.status}</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleDownloadPDF}
              >
                Descargar PDF
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                onClick={handleSendEmail}
              >
                Enviar por correo
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              ❌
            </button>
            <h3 className="text-xl font-bold mb-4">Solicitar Bodega</h3>

            {formData.warehouseId && warehouses.find(wh => wh.id === formData.warehouseId) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="font-medium">
                  <span className="text-gray-700">Bodega seleccionada:</span> {warehouses.find(wh => wh.id === formData.warehouseId).descripcion}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Ciudad:</span> {warehouses.find(wh => wh.id === formData.warehouseId).ciudad?.nombre || 'No especificada'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Precio diario:</span> ${warehouses.find(wh => wh.id === formData.warehouseId).precio?.toLocaleString() || 'No especificado'}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="mb-2">
                <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Producto
                </label>
                <input
                  type="text"
                  id="productType"
                  name="productType"
                  placeholder="Ej: Electrónica, Alimentos, Muebles..."
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={formData.fechaInicio || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    name="fechaFin"
                    value={formData.fechaFin || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Mostrar el cálculo del precio si ambas fechas están seleccionadas */}
              {formData.fechaInicio && formData.fechaFin && formData.warehouseId && (
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200 mb-2">
                  <h4 className="font-medium text-blue-700 mb-1">Detalles del alquiler</h4>
                  {(() => {
                    const startDate = new Date(formData.fechaInicio);
                    const endDate = new Date(formData.fechaFin);

                    // Solo calcular si la fecha de fin es posterior a la de inicio
                    if (endDate > startDate) {
                      const selectedWarehouse = warehouses.find(wh => wh.id === formData.warehouseId);
                      const daysOfRental = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                      const dailyPrice = selectedWarehouse?.precio || 0;
                      const totalPrice = daysOfRental * dailyPrice;

                      return (
                        <>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Duración:</span> {daysOfRental} {daysOfRental === 1 ? 'día' : 'días'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Precio diario:</span> ${dailyPrice.toLocaleString()}
                          </p>
                          <p className="text-sm font-medium text-blue-800 mt-1">
                            <span className="font-bold">Precio total estimado:</span> ${totalPrice.toLocaleString()}
                          </p>
                        </>
                      );
                    }
                    return <p className="text-sm text-red-500">La fecha de fin debe ser posterior a la fecha de inicio</p>;
                  })()}
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center"
                >
                  Enviar Solicitud
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors cursor-pointer flex items-center justify-center"
                  onClick={() => setIsModalOpen(false)}
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

export default ContractManagement;
