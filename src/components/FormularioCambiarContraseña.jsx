import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import api from "../services/api";
import logo from '../assets/imagenLogin.png';

const FormularioCambiarContraseña = () => {
    const [codigo, setCodigo] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const recoveryEmail = sessionStorage.getItem("recoveryEmail");

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleCodigoChange = (e) => setCodigo(e.target.value);
    const handleNuevaContrasenaChange = (e) => setNuevaContrasena(e.target.value);
    const handleConfirmarContrasenaChange = (e) => setConfirmarContrasena(e.target.value);

    const isButtonEnabled = codigo.trim() !== '' && 
                          nuevaContrasena.trim() !== '' && 
                          confirmarContrasena.trim() !== '' &&
                          nuevaContrasena === confirmarContrasena;

    const cambiarContrasena = async () => {
        if (!isButtonEnabled) return;

        try {
            await api.post("/cuenta/change-password", { 
                recoveryCode: codigo,
                newPassword: nuevaContrasena,
                email: recoveryEmail
            });
            
            // Limpiar el correo del sessionStorage después de cambiar la contraseña
            sessionStorage.removeItem("recoveryEmail");
            
            Swal.fire({
                title: "Contraseña cambiada exitosamente",
                text: "Tu contraseña ha sido actualizada",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => navigate("/login"));
        } catch (error) {
            Swal.fire({ 
                title: "Error", 
                text: "No se pudo cambiar la contraseña. Verifica el código o intenta nuevamente.", 
                icon: "error" 
            });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#DBECFE]">
            <div className="flex w-[80%] max-w-4xl shadow-lg rounded-xl overflow-hidden">
                {/* Sección de la imagen */}
                <div className="w-1/2 hidden lg:flex justify-center items-center bg-[#DBECFE]">
                    <img src={logo} alt="Login" className="w-3/4" />
                </div>

                {/* Sección del formulario */}
                <div className="w-1/2 flex flex-col justify-center items-center bg-purple-200 p-10">
                    <h1 className="text-4xl font-bold mb-4">Store-It!</h1>
                    <p className="mb-8">Cambiar contraseña</p>
                    
                    {recoveryEmail && (
                        <div className="w-full mb-4 text-center">
                            <p className="text-sm text-gray-600">Código enviado a: {recoveryEmail}</p>
                        </div>
                    )}
                    
                    <div className="w-full mb-4">
                        <label className="block text-gray-700">Código de recuperación:</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded" 
                            value={codigo} 
                            onChange={handleCodigoChange} 
                            placeholder="Ingresa el código recibido"
                        />
                    </div>

                    <div className="w-full mb-4">
                        <label className="block text-gray-700">Nueva contraseña:</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="w-full p-2 border rounded" 
                                value={nuevaContrasena} 
                                onChange={handleNuevaContrasenaChange}
                                placeholder="Ingresa tu nueva contraseña"
                            />
                            <button 
                                type="button" 
                                className="absolute right-3 top-2" 
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>

                    <div className="w-full mb-4">
                        <label className="block text-gray-700">Confirmar contraseña:</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                className="w-full p-2 border rounded" 
                                value={confirmarContrasena} 
                                onChange={handleConfirmarContrasenaChange}
                                placeholder="Confirma tu nueva contraseña"
                            />
                            <button 
                                type="button" 
                                className="absolute right-3 top-2" 
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                        {nuevaContrasena !== confirmarContrasena && confirmarContrasena !== '' && (
                            <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button 
                            className={`px-6 py-2 rounded text-black ${
                                isButtonEnabled 
                                    ? 'bg-[#9ECAF9] hover:bg-[#7FA8E9]' 
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`} 
                            onClick={cambiarContrasena} 
                            disabled={!isButtonEnabled}
                        >
                            Cambiar contraseña
                        </button>
                        <button 
                            className="px-6 py-2 border rounded"
                            onClick={() => navigate("/login")}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormularioCambiarContraseña; 