import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import api from "../services/api";
import logo from '../assets/imagenLogin.png';

const FormularioLogin = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleUsuarioChange = (e) => setUsuario(e.target.value);
    const handleContrasenaChange = (e) => setContrasena(e.target.value);

    const isButtonEnabled = usuario.trim() !== '' && contrasena.trim() !== '';

    const login = async () => {
        if (!isButtonEnabled) return;

        try {
            const response = await api.post("/cuenta/login", { idNumber: usuario, password: contrasena });
            sessionStorage.setItem("token", response.data.token);
            Swal.fire({
                title: "Inicio de sesión exitoso",
                text: "Bienvenido a la plataforma",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => navigate("/"));
        } catch (error) {
            Swal.fire({ title: "Error", text: "Credenciales incorrectas", icon: "error" });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#DBECFE]">
            <div className="flex w-[80%] max-w-4xl shadow-lg rounded-xl overflow-hidden">

                {/* Sección de la imagen ahora está a la izquierda */}
                <div className="w-1/2 hidden lg:flex justify-center items-center bg-[#DBECFE]">
                    <img src={logo} alt="Login" className="w-3/4" />
                </div>

                {/* Sección del formulario ahora está a la derecha */}
                <div className="w-1/2 flex flex-col justify-center items-center bg-purple-200 p-10">
                    <h1 className="text-4xl font-bold mb-4">Store-It!</h1>
                    <p className="mb-8">waterhouse magnamente</p>
                    <div className="w-full mb-4">
                        <label className="block text-gray-700">Usuario:</label>
                        <input type="text" className="w-full p-2 border rounded" value={usuario} onChange={handleUsuarioChange} />
                    </div>
                    <div className="w-full mb-4">
                        <label className="block text-gray-700">Contraseña:</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} className="w-full p-2 border rounded" value={contrasena} onChange={handleContrasenaChange} />
                            <button type="button" className="absolute right-3 top-2" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className={`px-6 py-2 rounded text-black ${isButtonEnabled ? 'bg-[#9ECAF9] hover:bg-[#7FA8E9]' : 'bg-gray-400 cursor-not-allowed'}`} onClick={login} disabled={!isButtonEnabled}>Ingresar</button>
                        <button className="px-6 py-2 border rounded" onClick={() => navigate("/registrarse")}>Registrarse</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FormularioLogin;
