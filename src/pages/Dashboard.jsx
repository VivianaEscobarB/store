import React, { useState } from 'react';
import Logo from '../components/Logo';
import MenuSection from '../components/MenuSection';
import UserInfo from '../components/UserInfo';

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
        return <div>Formulario para añadir productos</div>;
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Menú lateral */}
      <nav
        className={`fixed md:relative top-0 left-0 h-full bg-[#DAEBFE] text-white p-3 md:p-6 w-[250px] md:w-[318px] border-r border-[#E0E0E0] transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <Logo />
        <MenuSection
          title="General"
          options={[
            { icon: '🏠', text: 'Inicio' },
            { icon: '📦', text: 'Inventario' },
            { icon: '📊', text: 'Reportes' },
          ]}
          onOptionClick={(option) => {
            setSelectedOption(option);
            setIsMenuOpen(false); // Cierra el menú al seleccionar una opción
          }}
        />
        <MenuSection
          title="Otros"
          options={[
            { icon: '❓', text: 'Ayuda' },
            { icon: '⚙️', text: 'Configuración' },
          ]}
          onOptionClick={(option) => {
            setSelectedOption(option);
            setIsMenuOpen(false); // Cierra el menú al seleccionar una opción
          }}
        />
        <MenuSection
          title="Acciones rápidas"
          options={[
            { icon: '👤', text: 'Crear colaboradores' },
            { icon: '➕', text: 'Añadir Producto' },
            { icon: '📑', text: 'Crear orden' },
            { icon: '🏢', text: 'Añadir proveedor' },
          ]}
          onOptionClick={(option) => {
            setSelectedOption(option);
            setIsMenuOpen(false); // Cierra el menú al seleccionar una opción
          }}
        />
      </nav>

      {/* Contenido principal */}
      <main className='flex-1 flex flex-col'>
        <header className='bg-white shadow-md p-4 flex justify-between items-center'>
          <h1 className='text-lg font-bold'>Panel de Control</h1>
          <UserInfo username="Juan Pérez" />
        </header>
        <div className='p-4 flex-1 bg-[#F3F4F6]'>{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;