import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from '../assets/imagenLogin.png';

const FormularioRestablecerContraseña = () => {
    const [codigo, setCodigo] = useState("");
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nuevaContraseña !== confirmarContraseña) {
            Swal.fire("⚠️ Error", "Las contraseñas no coinciden.", "error");
            return;
        }

        if (nuevaContraseña.length < 6) {
            Swal.fire("⚠️ Error", "La contraseña debe tener al menos 6 caracteres.", "error");
            return;
        }

        setLoading(true);

        try {
            // Aquí iría la llamada a la API para restablecer la contraseña
            await api.post("/cuenta/reset-password", {
                code: codigo,
                newPassword: nuevaContraseña
            });

            Swal.fire({
                icon: "success",
                title: "Contraseña actualizada",
                text: "Tu contraseña ha sido actualizada exitosamente.",
                confirmButtonText: "Aceptar",
            }).then(() => {
                navigate("/login");
            });
        } catch (err) {
            Swal.fire("❌ Error", "No se pudo restablecer la contraseña. Inténtalo de nuevo.", "error");
            console.error("Error al restablecer la contraseña:", err);
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
                        Restablecer contraseña
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col text-lg gap-3 w-full text-left">
                        <p className="text-base">Ingresa el código y tu nueva contraseña</p>

                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                            placeholder="Código de verificación"
                            required
                        />

                        <input
                            type="password"
                            value={nuevaContraseña}
                            onChange={(e) => setNuevaContraseña(e.target.value)}
                            className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                            placeholder="Nueva contraseña"
                            required
                        />

                        <input
                            type="password"
                            value={confirmarContraseña}
                            onChange={(e) => setConfirmarContraseña(e.target.value)}
                            className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                            placeholder="Confirmar contraseña"
                            required
                        />

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
                                ${loading ? 'bg-purple-200 text-black' : 'bg-[#DBECFE] text-black'}`}
                                disabled={loading}
                            >
                                {loading ? "Procesando..." : "Restablecer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormularioRestablecerContraseña;