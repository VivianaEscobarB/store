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
    clientName: '',
    product: '',
    startDate: '',
    endDate: '',
    status: 'Pendiente',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredWarehouses([]);
    } else {
      const filtered = warehouses.filter((warehouse) =>
        warehouse.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredWarehouses(filtered);
    }
  };

  const handleSelectWarehouse = (warehouse) => {
    setSearchTerm(warehouse);
    setFilteredWarehouses([]);
    setSelectedWarehouse(warehouse);
    setIsWarehouseModalOpen(true);
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
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/bodegas');
      console.log('Bodegas recibidas:', response.data);
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      Swal.fire('Error', 'No se pudieron cargar las bodegas', 'error');
    }
  };

  const fetchWarehouseRequests = async () => {
    try {
      const response = await api.get('/contratos');
      console.log('Solicitudes recibidas:', response.data);
      setWarehouseRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
    }
  };

  const fetchContratos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contratos');
      setContracts(response.data);
    } catch (error) {
      console.error('Error al obtener contratos:', error);
      Swal.fire('Error', 'No se pudieron cargar los contratos', 'error');
    }
  };

  const createContrato = async (contratoData) => {
    try {
      await axios.post('http://localhost:5000/api/contratos', contratoData);
      await fetchContratos();
      Swal.fire('Éxito', 'Contrato creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear contrato:', error);
      Swal.fire('Error', 'No se pudo crear el contrato', 'error');
    }
  };

  const updateContrato = async (id, contratoData) => {
    try {
      await axios.put(`http://localhost:5000/api/contratos/${id}`, contratoData);
      await fetchContratos();
      Swal.fire('Éxito', 'Contrato actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar contrato:', error);
      Swal.fire('Error', 'No se pudo actualizar el contrato', 'error');
    }
  };

  const deleteContrato = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contratos/${id}`);
      await fetchContratos();
      Swal.fire('Éxito', 'Contrato eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar contrato:', error);
      Swal.fire('Error', 'No se pudo eliminar el contrato', 'error');
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

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
      warehouse: selectedWarehouse,
      productType: e.target.productType.value,
      rentalPeriod: e.target.rentalPeriod.value,
      requestDate: new Date().toLocaleDateString(),
      requester: userName,
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

  const handleDeleteRequest = async (index) => {
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
        const pendingRequests = warehouseRequests.filter(request => request.status === 'Pendiente');
        const requestToDelete = pendingRequests[index];
        await axios.delete(`http://localhost:5000/api/warehouse-requests/${requestToDelete.id}`);
        await fetchWarehouseRequests();
        Swal.fire('Eliminado', 'La solicitud ha sido eliminada.', 'success');
      } catch (error) {
        console.error('Error deleting request:', error);
        Swal.fire('Error', 'No se pudo eliminar la solicitud', 'error');
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
            placeholder="Buscar bodega..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 outline-none bg-transparent"
          />
        </div>
        {filteredWarehouses.length > 0 && (
          <ul className="absolute top-full left-0 w-full max-w-md bg-[#FFFFFF] border border-gray-300 rounded-md shadow-lg mt-1 z-10">
            {filteredWarehouses.slice(0, 5).map((warehouse, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectWarehouse(warehouse)}
              >
                {warehouse}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Bodegas Activas</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Bodega</th>
              <th className="border border-gray-300 p-2 text-left">Tipo de Producto</th>
              <th className="border border-gray-300 p-2 text-left">Período de Alquiler</th>
              <th className="border border-gray-300 p-2 text-left">Fecha de Solicitud</th>
              <th className="border border-gray-300 p-2 text-left">Solicitante</th>
            </tr>
          </thead>
          <tbody>
            {warehouseRequests.filter(request => request.status === 'Activa').length > 0 ? (
              warehouseRequests
                .filter(request => request.status === 'Activa')
                .map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{request.warehouse}</td>
                    <td className="border border-gray-300 p-2">{request.productType}</td>
                    <td className="border border-gray-300 p-2">{request.rentalPeriod}</td>
                    <td className="border border-gray-300 p-2">{request.requestDate}</td>
                    <td className="border border-gray-300 p-2">{request.requester}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No hay bodegas activas registradas.
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
              <th className="border border-gray-300 p-2 text-left">Solicitante</th>
              <th className="border border-gray-300 p-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {warehouseRequests.filter(request => request.status === 'Pendiente').length > 0 ? (
              warehouseRequests
                .filter(request => request.status === 'Pendiente')
                .map((request, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 relative group"
                  >
                    <td className="border border-gray-300 p-2">{request.warehouse}</td>
                    <td className="border border-gray-300 p-2">{request.productType}</td>
                    <td className="border border-gray-300 p-2">{request.rentalPeriod}</td>
                    <td className="border border-gray-300 p-2">{request.requestDate}</td>
                    <td className="border border-gray-300 p-2">{request.requester}</td>
                    <td className={`border border-gray-300 p-2 ${getStatusStyle(request.status)}`}>
                      {request.status}
                    </td>
                    <td className="absolute inset-0 flex justify-center items-center bg-gray-45 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleDeleteRequest(index)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No hay bodegas solicitadas registradas.
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

      {isWarehouseModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => setIsWarehouseModalOpen(false)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">Solicitar Bodega</h3>
            <p className="mb-2"><strong>Bodega seleccionada:</strong> {selectedWarehouse}</p>
            <p className="mb-2"><strong>Fecha de solicitud:</strong> {new Date().toLocaleDateString()}</p>
            <p className="mb-4"><strong>Solicitante:</strong> {userName}</p>
            <form onSubmit={handleWarehouseSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="productType"
                placeholder="Tipo de producto"
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="rentalPeriod"
                placeholder="Período de alquiler (ej. 3 meses)"
                className="p-2 border border-gray-300 rounded-md"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Solicitar
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                onClick={() => setIsWarehouseModalOpen(false)}
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
