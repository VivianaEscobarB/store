import logo from '../assets/imagenLogin.png';
import { useState } from 'react';

const MenuBodega = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarConsulta, setMostrarConsulta] = useState(false);

    const [bodegas, setBodegas] = useState([
        {
            id: 1,
            descripcion: "Bodega Central",
            ciudad: "Bogotá",
            movimientos: ["Entrada 100 cajas", "Salida 20 cajas"],
            comentarios: ["Buen estado", "Revisar humedad"]
        },
        {
            id: 2,
            descripcion: "Bodega Norte",
            ciudad: "Medellín",
            movimientos: ["Entrada 50 cajas"],
            comentarios: ["Faltan estanterías"]
        },
        {
            id: 3,
            descripcion: "Bodega Sur",
            ciudad: "Cali",
            movimientos: ["Salida 10 cajas"],
            comentarios: []
        }
    ]);
    const [bodegaIdMovimiento, setBodegaIdMovimiento] = useState('');
    const [nuevoMovimiento, setNuevoMovimiento] = useState('');

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
                            <button
                                onClick={() => setMostrarFormulario(true)}
                                className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow w-full transition-all duration-200 justify-between">

                                Gestionar Bodega
                            </button>
                        </div>
                </nav>
            </aside>

            {/* Modal: gestionar Bodega */}
            {mostrarFormulario && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto relative"
                    >
                        <button
                            onClick={() => setMostrarFormulario(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-purple-800">Gestión de Bodegas</h2>

                        {/* Sección de Movimientos */}
                        <div className="mb-6 border-b pb-4">
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">Movimientos de Bodega</h3>
                            <form
                                className="grid grid-cols-3 gap-4 text-sm"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const idParsed = parseInt(bodegaIdMovimiento);
                                    if (!idParsed || !nuevoMovimiento.trim()) return;

                                    const copia = [...bodegas];
                                    const idx = copia.findIndex(b => b.id === idParsed);
                                    if (idx === -1) return;

                                    copia[idx].movimientos.push(nuevoMovimiento.trim());
                                    setBodegas(copia);
                                    setNuevoMovimiento('');
                                    setBodegaIdMovimiento('');
                                }}
                            >
                                <input
                                    value={bodegaIdMovimiento}
                                    onChange={(e) => setBodegaIdMovimiento(e.target.value)}
                                    placeholder="ID Bodega"
                                    className="border p-2 rounded"
                                    required
                                />
                                <input
                                    value={nuevoMovimiento}
                                    onChange={(e) => setNuevoMovimiento(e.target.value)}
                                    placeholder="Movimiento"
                                    className="border p-2 rounded"
                                    required
                                />
                                <button type="submit" className="bg-purple-500 text-white rounded px-4 py-2 hover:bg-purple-600">
                                    Agregar Movimiento
                                </button>
                            </form>
                        </div>

                        {/* Tabla de Bodegas */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-purple-300">
                                <thead className="bg-purple-100 text-purple-800">
                                <tr>
                                    <th className="p-2 border">ID</th>
                                    <th className="p-2 border">Descripción</th>
                                    <th className="p-2 border">Ciudad</th>
                                    <th className="p-2 border">Movimientos</th>
                                    <th className="p-2 border">Comentarios</th>
                                </tr>
                                </thead>
                                <tbody>
                                {bodegas.map((bodega) => (
                                    <tr key={bodega.id} className="text-gray-700">
                                        <td className="p-2 border text-center">{bodega.id}</td>
                                        <td className="p-2 border">{bodega.descripcion}</td>
                                        <td className="p-2 border">{bodega.ciudad}</td>
                                        <td className="p-2 border">
                                            <ul className="list-disc pl-4">
                                                {bodega.movimientos.map((m, i) => (
                                                    <li key={i} className="flex justify-between">
                                                        {m}
                                                        <button
                                                            onClick={() => {
                                                                const copia = [...bodegas];
                                                                copia.find(b => b.id === bodega.id).movimientos.splice(i, 1);
                                                                setBodegas(copia);
                                                            }}
                                                            className="ml-2 text-red-500 text-xs"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="p-2 border">
                                            <ul className="list-disc pl-4">
                                                {bodega.comentarios.map((c, i) => (
                                                    <li key={i}>{c}</li>
                                                ))}
                                            </ul>
                                            <input
                                                className="mt-2 border p-1 text-sm w-full"
                                                placeholder="Nuevo comentario"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        e.preventDefault();
                                                        const copia = [...bodegas];
                                                        const idx = copia.findIndex(b => b.id === bodega.id);
                                                        copia[idx].comentarios.push(e.target.value);
                                                        setBodegas(copia);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
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

