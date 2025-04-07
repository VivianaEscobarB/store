import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import logo from '../assets/imagenLogin.png'; // Importar la imagen

const FormularioRegistrarse = () => {

    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const navigate = useNavigate();


    const handleNombresChange = (e) => setNombres(e.target.value);
    const handleApellidosChange = (e) => setApellidos(e.target.value);
    const handleFechaNacimientoChange = (e) => setFechaNacimiento(e.target.value);
    const handleTelefonoChange = (e) => setTelefono(e.target.value);
    const handleCorreoChange = (e) => setCorreo(e.target.value);
    const handleContrasenaChange = (e) => setContrasena(e.target.value);
    const handleConfirmarContrasenaChange = (e) => setConfirmarContrasena(e.target.value);

    const isButtonEnabled = nombres.trim() !== '' && apellidos.trim() !== '' && fechaNacimiento.trim() !== '' && telefono.trim() !== '' && correo.trim() !== '' && contrasena.trim() !== '' && contrasena === confirmarContrasena;

    const registrarse = async () => {
        if (!isButtonEnabled) return;

        try {
            // Aquí se realizaría la llamada a la API para registrar al usuario
            Swal.fire({
                title: "Registro exitoso",
                text: "Ahora puedes iniciar sesión",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => navigate("/"));
        } catch (error) {
            Swal.fire({ title: "Error", text: "No se pudo completar el registro", icon: "error" });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#DBECFE]">
             {/* Sección de la imagen */}
             <div className="w-1/2 hidden lg:flex justify-center items-center bg-[#DBECFE]">
                    <img src={logo} alt="Registro" className="w-3/4" />
                </div>
                {/* Sección del formulario */}
                <div className="w-[493px] h-[590px] bg-[#D1BBFF] p-0.2 flex flex-col justify-center items-center rounded-2xl m-10 font-semibold">
                    <h1 className="text-4xl font-bold mb-2 text-center">Store-it!</h1>
                    <h3 className="text-xl mb-2 text-center font-bold">Registro</h3>
                    <div className="mb-2 w-3/4">
                        <label className="block text-black text-5xs ml-3">Nombres:</label>
                        <input type="text" placeholder="Nombres" className="w-full p-1.5 border border-gray-400 rounded-full bg-[#F9F9F9] placeholder:font-normal font-normal" value={nombres} onChange={handleNombresChange} />
                    </div>
                    <div className="mb-2 w-3/4">
                        <label className="block text-black text-5xs ml-3">Apellidos:</label>
                        <input type="text" placeholder="Apellidos" className="w-full p-1.5 border border-gray-400 rounded-full bg-[#F9F9F9] placeholder:font-normal font-normal" value={apellidos} onChange={handleApellidosChange} />
                    </div>
                    <div className="mb-2 w-3/4">
                        <label className="block text-black text-5xs ml-3">Fecha de nacimiento:</label>
                        <input type="date" placeholder="Fecha de nacimiento" className="w-full p-1.5 border border-gray-400 rounded-full bg-[#F9F9F9] placeholder:font-normal font-normal" value={fechaNacimiento} onChange={handleFechaNacimientoChange} />
                    </div>
                    <div className="mb-2 w-3/4">
                        <label className="block text-black text-5xs ml-3">Teléfono:</label>
                        <input type="text" placeholder="Teléfono" className="w-full p-1.5 border border-gray-400 rounded-full bg-[#F9F9F9] placeholder:font-normal font-normal" value={telefono} onChange={handleTelefonoChange} />
                    </div>
                    <div className="mb-2 w-3/4">
                        <label className="block text-black text-5xs ml-3">Correo:</label>
                        <input type="email" placeholder="Correo" className="w-full p-1.5 border border-gray-400 rounded-full bg-[#F9F9F9] placeholder:font-normal font-normal" value={correo} onChange={handleCorreoChange} />
                    </div>
                    <div className="mb-2 w-3/4">
                        <label className="block text-black text-5xs ml-3">Contraseña:</label>
                        <input type="password" placeholder="Contraseña" className="w-full p-1.5 border border-gray-400 rounded-full bg-[#F9F9F9] placeholder:font-normal font-normal" value={contrasena} onChange={handleContrasenaChange} />
                    </div>
                    <div className="flex w-3/4 gap-2 mt-2">
                        <button className={`w-1/2 px-2 py-1.5 rounded-full text-white ${isButtonEnabled ? 'bg-[#9ECAF9] hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`} onClick={registrarse} disabled={!isButtonEnabled}>Registrarse</button>
                        <button className="w-1/2 px-2 py-1.5 rounded-full text-gray-700 bg-white border border-gray-300 hover:bg-gray-100" onClick={() => navigate(-1)}>Regresar</button>
                    </div>
                </div>
        </div>
    );
};

export default FormularioRegistrarse;
