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
  const userRole = sessionStorage.getItem("userRole");

  // Definir las opciones del menú según el rol
  const getMenuOptions = () => {
    if (userRole === 'cliente') {
      return [
        { icon: <FaBell />, text: 'Notificaciones' },
        { icon: <FaFileContract />, text: 'Contratos' },
        { icon: <FaStore />, text: 'Consultar movimientos' }
      ];
    } else if (userRole === 'vendedor') {
      return [
        { icon: <FaBox />, text: 'Solicitudes de Alquiler' },
        { icon: <FaBell />, text: 'Notificaciones' }
      ];
    }
    return [];
  };

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


  const renderContent = () => {
    switch (selectedOption) {
      case 'Solicitudes de Alquiler':
        return <RentalRequests />;
      case 'Notificaciones':
        return <Notifications />;
      case 'Consultar movimientos':
        return <MovementReport />;  
      case 'Contratos':
        return <ContractManagement/>;
      default:
        return <Notifications />;
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
            username={userData ? `${userData.nombre}` : "Usuario"} 
            role={userData?.rol || userRole}
          />
        </div>
        <MenuSection
          title="General"
          options={getMenuOptions()}
          onOptionClick={(option) => {
            setSelectedOption(option);
            if (option === 'Notificaciones') {
              setUnreadNotifications(0);
            }
            setIsMenuOpen(false); // Cierra el menú al seleccionar una opción
          }}
        />
        
      </nav>

      {/* Contenido principal */}
      <main className='flex-1 flex flex-col h-full w-full'> {/* Añadido w-full */}
        <header className='bg-[#DBECFE] shadow-md p-8 flex justify-between items-center w-full'> {/* Añadido w-full */}
          <h1 className='text-2xl font-bold'>{selectedOption}</h1>
        </header>
        <div className='p-4 flex-1 bg-[#DBECFE] flex justify-center items-start w-full'> {/* Añadido w-full */}
          <div className="bg-[white] w-full h-full p-8 rounded-lg shadow-lg overflow-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;