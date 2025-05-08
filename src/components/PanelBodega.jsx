const PanelBodega = () => {
    return (
        <main className="flex-1 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#e0e7ff] via-[#DBECFE] to-[#f3f4f6] transition-all duration-300">
            <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl p-10 border border-purple-100">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-800 tracking-tight">Información de Bodega</h2>
                <div className="space-y-6 text-lg">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-700">Ubicación de un producto:</span>
                        <span className="text-gray-500">____________________</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-700">Capacidad disponible:</span>
                        <span className="text-gray-500">____________________</span>
                    </div>
                    <div>
                        <span className="font-semibold text-purple-700">Historial de movimiento:</span>
                        <ul className="list-disc ml-8 mt-2 text-base text-gray-700">
                            <li>Movimiento 1</li>
                            <li>Movimiento 2</li>
                            <li>Movimiento 3</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PanelBodega;