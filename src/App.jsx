import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login'
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/DashBoard';
import Registrarse from './pages/registrarse';

function App() {
  return (
    // Se utiliza el componente Router para manejar la navegación en la aplicación
    <Router>
      {/* Toaster permite mostrar notificaciones emergentes en la parte superior */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      
      {/* Se definen las rutas de la aplicación usando el componente Routes */}
      <Routes>

        {/* Ruta para el inicio de sesión */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registrarse" element={<Registrarse />} />
      </Routes>
    </Router>
  )
}

export default App
