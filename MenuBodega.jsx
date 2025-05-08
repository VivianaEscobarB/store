import logo from '../assets/imagenLogin.png';

const MenuBodega = () => {
    return (
        <aside className="h-screen w-80 bg-[#CEABFF] flex flex-col items-center py-10 shadow-2xl rounded-r-3xl transition-all duration-300">
            <div className="flex flex-col items-center mb-8">
                <img src={logo} alt="Logo" className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-contain" />
                <div className="w-16 h-16 rounded-full bg-white border-2 border-purple-300 flex items-center justify-center -mt-8 mb-2 shadow-md">
                    {/* Aquí podría ir un avatar de usuario */}
                    <span className="text-2xl font-bold text-purple-700">NU</span>
                </div>
                <div className="text-xl font-semibold text-purple-900">Nombre Usuario</div>
            </div>
            <nav className="flex flex-col gap-4 w-full px-8">
                <button className="flex items-center gap-3 py-3 px-5 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200">
                    {/* icono */}
                    <span>General</span>
                </button>
                <button className="flex items-center gap-3 py-3 px-5 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200">
                    {/* icono */}
                    <span>Consultar</span>
                </button>
                <button className="flex items-center gap-3 py-3 px-5 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200">
                    {/* icono */}
                    <span>Reportes</span>
                </button>
                <button className="flex items-center gap-3 py-3 px-5 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200">
                    {/* icono */}
                    <span>Acciones rápidas</span>
                </button>
                <div className="relative">
                    <button className="flex items-center gap-3 py-3 px-5 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow w-full transition-all duration-200 justify-between">
                        <span>Crear registro</span> <span className="ml-2">▼</span>
                    </button>
                    <div className="ml-6 mt-2 flex flex-col gap-2">
                        <button className="py-2 px-4 rounded-lg bg-gray-100 hover:bg-purple-100 text-left text-base transition-all duration-200">Entrada Producto</button>
                        <button className="py-2 px-4 rounded-lg bg-gray-100 hover:bg-purple-100 text-left text-base transition-all duration-200">Salida Producto</button>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default MenuBodega;
