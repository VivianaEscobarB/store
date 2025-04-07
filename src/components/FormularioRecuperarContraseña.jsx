import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/imagenLogin.png';

const FormularioRecuperarContraseña = () => {
    const [correo, setCorreo] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/cambiarContraseña");
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#DBECFE] rounded-3xl p-10">
            <div className="flex shadow-2xl w-full max-w-4xl bg-purple-200 rounded-2xl overflow-hidden">
                <div className="w-1/2 flex items-center justify-center p-6 bg-[#DBECFE]">
                    <img src={logo} alt="Login" className="w-3/4 h-auto max-h-64 object-contain" />
                </div>

                <div className="w-1/2 flex flex-col justify-center p-6 sm:p-10 gap-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)] text-center">
                        Recuperar contraseña
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col text-lg gap-3 w-full text-left">
                        <p className="text-base">Ingresa tu correo para recuperar tu contraseña</p>

                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                            placeholder="Ingrese su correo electrónico"
                        />

                        <hr className="border-t border-gray-600 my-4" />

                        <div className="flex justify-center gap-4 w-full">
                            <button 
                                type="button" 
                                className="w-full px-6 py-2 text-lg sm:text-2xl rounded-md bg-gray-400 hover:bg-gray-500 text-white"
                                onClick={() => navigate("/login")}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-full px-6 py-2 text-lg sm:text-2xl rounded-md border-2 border-black bg-[#DBECFE] text-black"
                            >
                                Recuperar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormularioRecuperarContraseña;
