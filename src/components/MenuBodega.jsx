import logo from '../assets/imagenLogin.png';
import { useState } from 'react';

const MenuBodega = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarConsulta, setMostrarConsulta] = useState(false);

    return (
        <>
            <aside className="h-screen w-80 bg-[#CEABFF] flex flex-col items-center py-10 shadow-2xl rounded-r-3xl transition-all duration-300">
                <div className="flex flex-col items-center mb-8">
                    <img src={logo} alt="Logo" className="w-17 h-17 rounded-full border-4 border-white shadow-lg object-contain" />
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-purple-300 flex items-center justify-center -mt-8 mb-2 shadow-md">
                        <span className="text-2xl font-bold text-purple-700">NU</span>
                    </div>
                    <div className="text-xl font-semibold text-purple-900">Nombre Usuario</div>
                </div>

                <nav className="flex flex-col gap-4 w-full px-2">
                    <button className="flex items-center gap-3 py-3 px-5 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200">
                        <span>General</span>
                    </button>

                    <button
                        onClick={() => setMostrarConsulta(true)}
                        className="flex items-center gap-3 py-2 px-4 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200"
                    >
                        <span>Consultar</span>
                    </button>

                    <button className="flex items-center gap-3 py-2 px-4 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200">
                        <span>Reportes</span>
                    </button>

                    <button className="flex items-center gap-3 py-2 px-4 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200">
                        <span>Acciones rápidas</span>
                    </button>

                    <div className="relative">
                        <button className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow w-full transition-all duration-200 justify-between">
                            <span>Crear registro</span> <span className="ml-2">▼</span>
                        </button>

                        <div className="ml-6 mt-2 flex flex-col gap-2">
                            <button className="py-2 px-2 rounded-lg hover:bg-purple-100 text-left text-base transition-all duration-200">
                                Entrada Producto
                            </button>
                            <button className="py-2 px-2 rounded-lg hover:bg-purple-100 text-left text-base transition-all duration-200">
                                Salida Producto
                            </button>
                            <button
                                onClick={() => setMostrarFormulario(true)}
                                className="py-2 px-2 rounded-lg hover:bg-purple-100 text-left text-base transition-all duration-200"
                            >
                                Crear Bodega
                            </button>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Modal: Crear Bodega */}
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
                                'Descripción',
                                'Espacio Ocupado (opcional)',
                                'Largo',
                                'Ancho',
                                'Alto',
                                'Teléfono (opcional)',
                                'Código Postal',
                                'Dirección (opcional)'
                            ].map((label, idx) => (
                                <label key={idx} className="flex flex-col">
                                    {label}
                                    <input
                                        type={label.includes('Largo') || label.includes('Ancho') || label.includes('Alto') ? 'number' : 'text'}
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

            {/* Modal: Consultar Bodega */}
            {mostrarConsulta && (
                <div
                    className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setMostrarConsulta(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-6 rounded-xl shadow-xl w-[500px] relative"
                    >
                        <button
                            onClick={() => setMostrarConsulta(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-black">Consultar Bodegas</h2>

                        <form className="flex flex-col gap-4 text-black text-sm">
                            <div>
                                <label>Descripción:</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label>Ciudad:</label>
                                    <select className="w-full border border-gray-300 rounded px-2 py-1 mt-1">
                                        <option>Todas</option>
                                        <option>Ciudad 1</option>
                                        <option>Ciudad 2</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label>Tipo de Bodega:</label>
                                    <select className="w-full border border-gray-300 rounded px-2 py-1 mt-1">
                                        <option>Todos</option>
                                        <option>Tipo A</option>
                                        <option>Tipo B</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="submit"
                                    className="bg-gray-200 hover:bg-gray-300 text-black font-medium px-4 py-1 rounded"
                                >
                                    Filtrar
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-200 hover:bg-gray-300 text-black font-medium px-4 py-1 rounded"
                                >
                                    Mostrar Todas
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </>
    );
};

export default MenuBodega;

