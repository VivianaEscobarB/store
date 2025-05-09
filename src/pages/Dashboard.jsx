import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../components/Logo';
import MenuSection from '../components/MenuSection';
import UserInfo from '../components/UserInfo';
import AddProductForm from '../components/AddProductForm';
import CreateCollaborators from '../components/CreateCollaborators'; // Importa el nuevo componente
import { FaBars, FaTimes, FaHome, FaBox, FaBell, FaQuestionCircle, FaCog, FaUserPlus, FaPlus, FaFileAlt, FaBuilding, FaInfo, FaFileContract, FaStore } from 'react-icons/fa';
import ContractManagement from '../components/ContractManagement';
import MovementReport from '../components/MovementReport';
import Notifications from '../components/Notifications';
import RentalRequests from '../components/RentalRequests';  // Nuevo import
import api from '../services/api';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('Inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/user/profile');
        console.log('User data:', response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications/unread');
        setUnreadNotifications(response.data.count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
    // Establecer un intervalo para verificar nuevas notificaciones
    const interval = setInterval(fetchNotifications, 30000); // cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (selectedOption) {
      case 'Inicio':
        return <div>Bienvenido al panel de control</div>;
      case 'Solicitudes de Alquiler':
        return <RentalRequests />;
      case 'Inventario':
        return <div>Gestión de inventario</div>;
      case 'Notificaciones':
        return <Notifications />;
      case 'Consultar movimientos':
        return <MovementReport />;  
      case 'Contratos':
        return <ContractManagement/>;
      case 'Crear colaboradores':
        return <CreateCollaborators />;
      case 'Añadir Producto':
        return <AddProductForm />;
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

  return (
    <div className='content-dashboard flex flex-col md:flex-row w-full h-screen font-sans bg-[#F3F4F6] text-[#1E293B]'>
      {/* Botón para abrir/cerrar el menú */}
      <button
        className='md:hidden bg-[#DAEBFE] text-white p-2 m-2 rounded shadow-md'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes className="h-12 w-12" /> : <FaBars className="h-12 w-12" />}
      </button>

      {/* Menú lateral */}
      <nav
        className={`fixed md:relative top-0 left-0 h-full bg-[#DAEBFE] text-white p-3 md:p-6 w-[250px] md:w-[318px] border-r border-[#E0E0E0] transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <Logo />
        <div className="w-full mt-4 flex flex-row items-center">
          <UserInfo 
            username={userData?.nombre || "Usuario"} 
            role={userData?.rol}
          />
        </div>
        <MenuSection
          title="General"
          options={[
            { icon: <FaHome />, text: 'Inicio' },
            { icon: <FaBox />, text: 'Solicitudes de Alquiler' },
            { 
              icon: (
                <div className="relative">
                  <FaBell />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
              ), 
              text: 'Notificaciones'
            },
            { icon: <FaStore/>, text: 'Consultar movimientos' },
            { icon: <FaFileAlt/>, text: 'Contratos' },
          ]}
          onOptionClick={(option) => {
            setSelectedOption(option);
            if (option === 'Notificaciones') {
              setUnreadNotifications(0);
            }
            setIsMenuOpen(false); // Cierra el menú al seleccionar una opción
          }}
        />
        <MenuSection
          title="Acciones rápidas"
          options={[
            { icon: <FaUserPlus />, text: 'Crear colaboradores' },
            { icon: <FaPlus />, text: 'Añadir Producto' },
          ]}
          onOptionClick={(option) => {
            setSelectedOption(option);
            setIsMenuOpen(false); // Cierra el menú al seleccionar una opción
          }}
        />
      </nav>

      {/* Contenido principal */}
      <main className='flex-1 flex flex-col h-full'>
        <header className='bg-[#DBECFE] shadow-md p-8 flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>{selectedOption}</h1> {/* Aumenta el tamaño de la letra */}
        </header>
        <div className='p-4 flex-1 bg-[#DBECFE] flex justify-center items-start'>
          <div className="bg-[white] w-full h-full p-8 rounded-lg shadow-lg overflow-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;