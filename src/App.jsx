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
    if (token) {
      // Decodificar el token JWT (puedes usar jwt-decode)
      // setUser(decoded);
    }
  }, []);

  // Componente para proteger rutas
  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.tipoUsuario)) {
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
        <Route path="/restablecerContraseña" element={<RestablecerContraseña />} />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['cliente']}>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/bodega" element={
          <PrivateRoute allowedRoles={['vendedor']}>
            <InicioBodega />
          </PrivateRoute>
        } />
        
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['admin']}>
            <InicioAdmin />
          </PrivateRoute>
        } />

        {/* Ruta de unauthorized */}
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
