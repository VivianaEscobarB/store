import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login'
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/DashBoard';
import RecuperarContraseña from './pages/recuperarContraseña';
// import CambiarContraseña from './pages/cambiarContraseña';
import Registrarse from './pages/registrarse';
import RestablecerContraseña from './pages/restablecerContraseña';
import InicioBodega from './pages/InicioBodega';
import InicioAdmin from './pages/InicioAdmin';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recuperarContraseña" element={<RecuperarContraseña />} />
        {/* <Route path="/cambiarContraseña" element={<CambiarContraseña />} /> */}
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/bodega" element={<InicioBodega/>} />
        <Route path="/admin" element={<InicioAdmin />} />
        <Route path="/restablecerContraseña" element={<RestablecerContraseña />} />
      </Routes>
    </Router>
  )
}

export default App
