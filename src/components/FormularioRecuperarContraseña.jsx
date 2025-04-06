import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from '../assets/imagenLogin.png';

const FormularioRecuperarContraseña = () => {
    const [correo, setCorreo] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.value;
        setCorreo(value);
        validateField(value);
    };

    const validateField = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setError(emailRegex.test(value) ? "" : "Correo electrónico inválido");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (error || !correo) {
            Swal.fire("⚠️ Error", "Ingresa un correo válido.", "error");
            return;
        }

        setLoading(true);

        try {
            await api.post("/cuenta/send-recovery-code", null, { params: { email: correo } });

            Swal.fire({
                icon: "success",
                title: "Código enviado",
                text: "Revisa tu correo para continuar con la recuperación.",
                confirmButtonText: "Aceptar",
            }).then(() => {
                navigate("/cambiarContraseña");
            });
        } catch (err) {
            Swal.fire("❌ Error", "No se pudo enviar el código. Inténtalo de nuevo.", "error");
            console.error("Error al enviar el código:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#DBECFE] rounded-3xl p-10">
            <div className="flex shadow-2xl w-full max-w-4xl bg-purple-200 rounded-2xl overflow-hidden">
                {/* Sección del logo con fondo azul */}
                <div className="w-1/2 flex items-center justify-center p-6 bg-[#DBECFE]">
                    <img src={logo} alt="Login" className="w-3/4 h-auto max-h-64 object-contain" />
                </div>

                {/* Sección del formulario */}
                <div className="w-1/2 flex flex-col justify-center p-6 sm:p-10 gap-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)] text-center">
                        Recuperar contraseña
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col text-lg gap-3 w-full text-left">
                        <p className="text-base">Ingresa tu correo para recuperar tu contraseña</p>

                        <input
                            type="email"
                            value={correo}
                            onChange={handleChange}
                            className={`text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)] ${error ? 'border-red-500' : ''}`}
                            placeholder="Ingrese su correo electrónico"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                        <hr className="border-t border-gray-600 my-4" />

                        <div className="flex justify-center gap-4 w-full">
                            <a href="/login" className="w-full sm:w-auto">
                                <button type="button" className="w-full px-6 py-2 text-lg sm:text-2xl rounded-md bg-gray-400 hover:bg-gray-500 text-white">
                                    Cancelar
                                </button>
                            </a>
                            <button
                                type="submit"
                                className={`w-full px-6 py-2 text-lg sm:text-2xl rounded-md border-2 border-black 
                        ${loading || error || !correo ? 'bg-purple-200 text-black' : 'bg-[#DBECFE] text-black'}`}
                                disabled={loading || error || !correo}
                            >
                                {loading ? "Enviando..." : "Recuperar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

    );
};

export default FormularioRecuperarContraseña;
