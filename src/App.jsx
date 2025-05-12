import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/DashBoard';
import RecuperarContraseña from './pages/recuperarContraseña';
import Registrarse from './pages/registrarse';
import RestablecerContraseña from './pages/restablecerContraseña';
import InicioBodega from './pages/InicioBodega';
import InicioAdmin from './pages/InicioAdmin';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole');
    if (token && userRole) {
      setUser({ tipoUsuario: userRole });
    }
  }, []);

  // Componente para proteger rutas
  const PrivateRoute = ({ children, allowedRoles }) => {
    const userRole = sessionStorage.getItem('userRole');
    console.log('Current userRole:', userRole);
    console.log('Allowed roles:', allowedRoles);

    if (!userRole) {
      console.log('No user role found, redirecting to login');
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      console.log('User role not allowed');
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperarContraseña" element={<RecuperarContraseña />} />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/bodega" element={<InicioBodega/>} />
        
        {/* Ruta del Dashboard */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['cliente', 'vendedor']}>
            <Dashboard />
          </PrivateRoute>
        } />
        
        {/* Ruta del Admin */}
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['admin']}>
            {/*<InicioAdmin />*/}
            <Dashboard />
          </PrivateRoute>
        } />

        {/* Ruta no autorizada */}
        <Route path="/unauthorized" element={
          <div className="flex items-center justify-center h-screen">
            <h1>No tienes permisos para acceder a esta página</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
