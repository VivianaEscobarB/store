import logo from '../assets/imagenLogin.png';

const MenuAdmin = () => {
    return (
        <aside className="h-180 w-80 bg-[#CEABFF] flex flex-col items-center py-10 shadow-2xl rounded-r-3xl transition-all duration-300">
            <div className="flex flex-col items-center mb-8">
                <img src={logo} alt="Logo" className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-contain" />
                <div className="w-16 h-16 rounded-full bg-white border-2 border-purple-300 flex items-center justify-center -mt-8 mb-2 shadow-md">
                    <span className="text-2xl font-bold text-purple-700">AD</span>
                </div>
                <div className="text-xl font-semibold text-purple-900">Admin</div>
            </div>
            <nav className="flex flex-col gap-4 w-full px-8">
                <button className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200"><span>General</span></button>
                <button className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200"><span>Inicio</span></button>
                <button className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200"><span>G. Bodega</span></button>
                <button className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200"><span>Reportes</span></button>
                <button className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200"><span>Acciones rápidas</span></button>
                <button className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200"><span>Colaboradores</span></button>
                <button className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/80 hover:bg-purple-200 text-left font-medium text-lg shadow transition-all duration-200"><span>Base de datos</span></button>
            </nav>
        </aside>
    );
};

export default MenuAdmin;