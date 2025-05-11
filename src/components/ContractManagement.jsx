import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { FaSearch, FaTrash } from 'react-icons/fa';
import API_URL from '../config/api';
import api from '../services/api';

const ContractManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [formData, setFormData] = useState({
  warehouseId: '', // Ya existe, asegúrate de que esté
  productType: '',
  rentalPeriod: '',
});
  const [selectedContract, setSelectedContract] = useState(null);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
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
      console.log('Datos completos de cada bodega:', response.data.map(bodega => ({
        id: bodega.id,
        idCiudad: bodega.idCiudad,
        ciudad: bodega.ciudad,
        tipoBodega: bodega.tipoBodega
      })));
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
       // console.log('Contratos recibidos:', response.data);
        // Transformar los datos para mantener el formato esperado
        const formattedRequests = response.data.map(contrato => ({
          id: contrato.id,
          warehouse: contrato.bodega?.descripcion || 'N/A',
          productType: contrato.tipoproducto || 'No especificado',
          rentalPeriod: `${new Date(contrato.fechaInicio).toLocaleDateString()} - ${new Date(contrato.fechaFin).toLocaleDateString()}`,
          requestDate: new Date(contrato.fechaInicio).toLocaleDateString(),
          requester: contrato.cliente?.nombre || 'No especificado',
          status: contrato.status,
          // Mantener los datos originales para otras funcionalidades
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
      const userId = sessionStorage.getItem('userId'); // Asegúrate de tener el ID del usuario guardado
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Primero intentamos obtener todos los contratos
      const contratosResponse = await api.get('/contratos', config);
      console.log('Respuesta de contratos:', contratosResponse.data);
      
      if (contratosResponse.data) {
        // Filtrar los contratos por el ID del cliente actual si es necesario
        const contratosCliente = contratosResponse.data.filter(contrato => 
          contrato.cliente && contrato.cliente.id === parseInt(userId)
        );
        
        setContracts(contratosCliente);
        //console.log('Contratos filtrados del cliente:', contratosCliente);
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

  const createContrato = async (contratoData) => {
    try {
      await axios.post('http://localhost:5000/api/contratos', contratoData);
      await fetchWarehouseRequests();
      Swal.fire('Éxito', 'Contrato creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear contrato:', error);
      Swal.fire('Error', 'No se pudo crear el contrato', 'error');
    }
  };
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createContrato(formData);
    setFormData({ clientName: '', product: '', startDate: '', endDate: '', status: 'Pendiente' });
    setIsModalOpen(false);
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

  const handleWarehouseSubmit = async (e) => {
    e.preventDefault();
    const newRequest = {
      warehouse: selectedWarehouse.descripcion,
      productType: e.target.productType.value,
      rentalPeriod: e.target.rentalPeriod.value, // Mantener el campo rentalPeriod como texto
      requestDate: new Date().toLocaleDateString(),
      status: 'Pendiente',
    };

    try {
      await axios.post('http://localhost:5000/api/warehouse-requests', newRequest);
      await fetchWarehouseRequests();
      setIsWarehouseModalOpen(false);
      Swal.fire('Éxito', 'Solicitud enviada correctamente', 'success');
    } catch (error) {
      console.error('Error creating request:', error);
      Swal.fire('Error', 'No se pudo crear la solicitud', 'error');
    }
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
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
        onClick={() => setIsModalOpen(false)}
      >
        ❌
      </button>
      <h3 className="text-xl font-bold mb-4">Solicitar Bodega</h3>
      {formData.warehouseId && warehouses.find(wh => wh.id === formData.warehouseId)?.descripcion && (
        <p className="mb-2"><strong>Bodega seleccionada:</strong> {warehouses.find(wh => wh.id === formData.warehouseId).descripcion}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="productType"
          placeholder="Tipo de Producto"
          value={formData.productType}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="rentalPeriod"
          placeholder="Período de Alquiler (ej. 3 meses)"
          value={formData.rentalPeriod}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer"
        >
          Enviar Solicitud
        </button>
        <button
          type="button"
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          Cancelar
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default ContractManagement;