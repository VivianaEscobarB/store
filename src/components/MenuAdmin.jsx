import { useState } from 'react';
import logo from '../assets/imagenLogin.png';

const MenuAdmin = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    return (
        <>
            <aside className="h-180 w-80 bg-[#CEABFF] flex flex-col items-center py-10 shadow-2xl rounded-r-3xl transition-all duration-300">
                <div className="flex flex-col items-center mb-8">
                    <img src={logo} alt="Logo" className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-contain" />
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-purple-300 flex items-center justify-center -mt-8 mb-2 shadow-md">
                        <span className="text-2xl font-bold text-purple-700">AD</span>
                    </div>
                    <div className="text-xl font-semibold text-purple-900">Admin</div>
                </div>
                <nav className="flex flex-col gap-4 w-full px-8">
                    <button className="py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 font-medium text-lg shadow transition-all duration-200">General</button>
                    <button className="py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 font-medium text-lg shadow transition-all duration-200">Inicio</button>
                    <button
                        onClick={() => setMostrarFormulario(true)}
                        className="py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 font-medium text-lg shadow transition-all duration-200"
                    >
                        Crear Bodega
                    </button>
                    <button className="py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 font-medium text-lg shadow transition-all duration-200">Reportes</button>
                    <button className="py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 font-medium text-lg shadow transition-all duration-200">Acciones rápidas</button>
                    <button className="py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 font-medium text-lg shadow transition-all duration-200">Colaboradores</button>
                    <button className="py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 font-medium text-lg shadow transition-all duration-200">Base de datos</button>
                </nav>
            </aside>

            {mostrarFormulario && (
                <div
                    className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50"
                    onClick={() => setMostrarFormulario(false)}
                >
                    <div
                        className="bg-[#def8fa] p-8 rounded-2xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setMostrarFormulario(false)}
                            className="absolute top-4 right-4 text-[#b078ff] hover:text-purple-400 text-2xl font-bold"
                        >
                            ×
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-[#b078ff]">Crear Nueva Bodega</h2>
                        <form className="flex flex-col gap-4 text-[#b078ff]">
                            {[
                                'ID Bodega',
                                'Descripción',
                                'Espacio Ocupado (opcional)',
                                'Largo',
                                'Ancho',
                                'Alto',
                                'Teléfono (opcional)',
                                'Código Postal',
                                'Dirección (opcional)',
                                'Capacidad',
                                'Número de Sector',
                                'Puestos de Sector'
                            ].map((label, idx) => (
                                <label key={idx} className="flex flex-col">
                                    {label}
                                    <input
                                        type={label.match(/Largo|Ancho|Alto|Capacidad|Número|Puestos/) ? 'number' : 'text'}
                                        className="border-b-2 border-[#CEABFF] bg-transparent p-1 focus:outline-none focus:border-purple-400 text-[#CEABFF] placeholder-purple-300"
                                        placeholder="Ingrese aquí..."
                                    />
                                </label>
                            ))}

                            <label className="flex items-center gap-2">
                                ¿Está lleno?
                                <input type="checkbox" className="accent-[#CEABFF]" />
                            </label>

                            <label className="flex flex-col">
                                Ciudad:
                                <select className="border-b-2 border-[#CEABFF] bg-transparent p-1 text-[#CEABFF] focus:outline-none">
                                    <option value="">Seleccionar Ciudad</option>
                                </select>
                            </label>

                            <label className="flex flex-col">
                                Departamento:
                                <input
                                    type="text"
                                    className="border-b-2 border-[#CEABFF] bg-transparent p-1 focus:outline-none text-[#CEABFF] placeholder-purple-300"
                                    placeholder="Ingrese departamento..."
                                />
                            </label>

                            <label className="flex flex-col">
                                País:
                                <input
                                    type="text"
                                    className="border-b-2 border-[#CEABFF] bg-transparent p-1 focus:outline-none text-[#CEABFF] placeholder-purple-300"
                                    placeholder="Ingrese país..."
                                />
                            </label>

                            <label className="flex flex-col">
                                Tipo de Bodega:
                                <select className="border-b-2 border-[#CEABFF] bg-transparent p-1 text-[#CEABFF] focus:outline-none">
                                    <option value="">Seleccionar Tipo de Bodega</option>
                                </select>
                            </label>

                            <div className="flex gap-4 mt-4">
                                <button
                                    type="submit"
                                    className="bg-[#b2eff3] text-purple-800 font-semibold py-2 px-4 rounded-xl hover:bg-[#a0dee2] transition-all"
                                >
                                    Crear Bodega
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMostrarFormulario(false)}
                                    className="text-sm text-[#b078ff] underline"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MenuAdmin;
