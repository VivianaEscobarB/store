import React, { useState } from 'react';
import Logo from '../components/Logo';
import MenuSection from '../components/MenuSection';
import UserInfo from '../components/UserInfo';
import AddProductForm from '../components/AddProductForm';
import { FaBars, FaTimes, FaHome, FaBox, FaChartBar, FaQuestionCircle, FaCog, FaUserPlus, FaPlus, FaFileAlt, FaBuilding } from 'react-icons/fa';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('Inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderContent = () => {
    switch (selectedOption) {
      case 'Inicio':
        return <div>Bienvenido al panel de control</div>;
      case 'Inventario':
        return <div>Gestión de inventario</div>;
      case 'Reportes':
        return <div>Visualización de reportes</div>;
      case 'Ayuda':
        return <div>Sección de ayuda</div>;
      case 'Configuración':
        return <div>Configuración del sistema</div>;
      case 'Crear colaboradores':
        return <div>Formulario para crear colaboradores</div>;
      case 'Añadir Producto':
        return <AddProductForm />;
      case 'Crear orden':
        return <div>Formulario para crear órdenes</div>;
      case 'Añadir proveedor':
        return <div>Formulario para añadir proveedores</div>;
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

  return (
    <div className='content-dashboard flex flex-col md:flex-row w-full font-sans bg-[#F3F4F6] text-[#1E293B]'>
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
        <div className="w-full mt-4 flex flex-col items-start">
          <UserInfo username="Juan Pérez" />
        </div>
        <MenuSection
          title="General"
          options={[
            { icon: <FaHome />, text: 'Inicio' },
            { icon: <FaBox />, text: 'Inventario' },
            { icon: <FaChartBar />, text: 'Reportes' },
          ]}
          onOptionClick={(option) => {
            setSelectedOption(option);
            setIsMenuOpen(false); // Cierra el menú al seleccionar una opción
          }}
        />
        <MenuSection
          title="Otros"
          options={[
            { icon: <FaQuestionCircle />, text: 'Ayuda' },
            { icon: <FaCog />, text: 'Configuración' },
          ]}
          onOptionClick={(option) => {
            setSelectedOption(option);
            setIsMenuOpen(false); // Cierra el menú al seleccionar una opción
          }}
        />
        <MenuSection
          title="Acciones rápidas"
          options={[
            { icon: <FaUserPlus />, text: 'Crear colaboradores' },
            { icon: <FaPlus />, text: 'Añadir Producto' },
            { icon: <FaFileAlt />, text: 'Crear orden' },
            { icon: <FaBuilding />, text: 'Añadir proveedor' },
          ]}
          onOptionClick={(option) => {
            setSelectedOption(option);
            setIsMenuOpen(false); // Cierra el menú al seleccionar una opción
          }}
        />
      </nav>

      {/* Contenido principal */}
      <main className='flex-1 flex flex-col'>
        <header className='bg-[#DBECFE] shadow-md p-8 flex justify-between items-center'>
          <h1 className='text-lg font-bold'>Panel de Control</h1>
        </header>
        <div className='p-4 flex-1 bg-[#DBECFE] flex justify-center items-start'>
          <div className="bg-[white] w-full max-w-4xl p-6 rounded-lg shadow-md">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;