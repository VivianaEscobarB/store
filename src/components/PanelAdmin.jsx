const PanelAdmin = () => {
    return (
        <main className="flex-1 flex flex-col items-center justify-start p-12 bg-gradient-to-br from-[#e0e7ff] via-[#DBECFE] to-[#f3f4f6] transition-all duration-300">
            <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl p-10 border border-purple-100 mb-8">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-800 tracking-tight">Registrar Colaboradores</h2>
                <form className="flex flex-col gap-4 items-center">
                    <input type="text" placeholder="Nombre" className="w-80 p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none text-lg transition" />
                    <input type="email" placeholder="Correo" className="w-80 p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none text-lg transition" />
                    <input type="password" placeholder="Contraseña" className="w-80 p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none text-lg transition" />
                    <input type="text" placeholder="Rol" className="w-80 p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none text-lg transition" />
                    <div className="flex gap-4 mt-4">
                        <button type="button" className="px-8 py-2 rounded-lg bg-[#DBECFE] text-purple-900 font-semibold border-2 border-purple-200 hover:bg-purple-200 transition">Crear</button>
                        <button type="button" className="px-8 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold border-2 border-gray-400 hover:bg-gray-400 transition">Cancelar</button>
                    </div>
                </form>
            </div>
            <div className="w-full max-w-4xl flex gap-8">
                <div className="flex-1 bg-white/90 rounded-2xl shadow-lg p-6 border border-purple-100">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">Base de datos</h3>
                    <ul className="list-disc ml-6 text-gray-700 text-base">
                        <li>Crear copias de seguridad</li>
                        <li>Restaurar la base de datos</li>
                    </ul>
                </div>
                <div className="flex-1 bg-white/90 rounded-2xl shadow-lg p-6 border border-purple-100">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">Historial de transacciones</h3>
                    <p className="text-gray-700 text-base">Cargar historial de transacciones.</p>
                </div>
            </div>
        </main>
    );
};

export default PanelAdmin;