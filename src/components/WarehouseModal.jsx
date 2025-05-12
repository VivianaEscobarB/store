import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const WarehouseModal = ({ warehouseId, onClose }) => {
    const [warehouseData, setWarehouseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newSector, setNewSector] = useState({ nombre: '', descripcion: '', largo: '', ancho: '', alto: '' });
    const [newPuestos, setNewPuestos] = useState({});

    const fetchWarehouseData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/bodegas/${warehouseId}`);
            setWarehouseData(response.data);
        } catch (err) {
            console.error('Error fetching warehouse data:', err);
            setError('Hubo un error al cargar los detalles de la bodega.');
        } finally {
            setLoading(false);
        }
    }, [warehouseId]);

    useEffect(() => {
        fetchWarehouseData();
    }, [fetchWarehouseData]);

    const handleAddSector = async () => {
    try {
        const espacioOcupado = parseFloat(newSector.largo) * parseFloat(newSector.ancho) * parseFloat(newSector.alto);

        const payload = {
            nombre: newSector.nombre,
            descripcion: newSector.descripcion,
            largo: parseFloat(newSector.largo),
            ancho: parseFloat(newSector.ancho),
            alto: parseFloat(newSector.alto),
            espacioOcupado,
            estadoLleno: newSector.estadoLleno || false,
            idBodega: warehouseId, // Usar el ID de la bodega actual
        };

        // Realizar la solicitud POST para agregar el nuevo sector
        await api.post('/sectores', payload);

        // Limpiar los campos del formulario después de la solicitud exitosa
        setNewSector({ nombre: '', descripcion: '', largo: '', ancho: '', alto: '', estadoLleno: false });

        // Refrescar los datos de la bodega para reflejar el nuevo sector
        fetchWarehouseData();
    } catch (err) {
        console.error('Error adding sector:', err);
        alert('Error al agregar el sector.');
    }
};


    const handleAddPuesto = async (sectorId) => {
        try {
            const puesto = newPuestos[sectorId];
            if (!puesto?.descripcion || !puesto?.fila || !puesto?.columna || !puesto?.largo || !puesto?.ancho || !puesto?.alto) {
                alert('Por favor completa todos los campos del puesto.');
                return;
            }

            const payload = {
                descripcion: puesto.descripcion,
                fila: parseInt(puesto.fila),
                columna: parseInt(puesto.columna),
                largo: parseFloat(puesto.largo),
                ancho: parseFloat(puesto.ancho),
                alto: parseFloat(puesto.alto),
                estadoLleno: puesto.estadoLleno || false,
                idSector: sectorId,
            };

            await api.post('/puestos', payload);
            setNewPuestos((prev) => ({ ...prev, [sectorId]: {} }));
            fetchWarehouseData();
        } catch (err) {
            console.error('Error adding puesto:', err);
            alert('Error al agregar el puesto.');
        }
    };

    // Calcular el porcentaje de espacio ocupado de un sector
    const calculateOccupiedSpace = (sector) => {
        if (!sector?.puestos?.length) return 0;

        const totalVolume = sector.largo * sector.ancho * sector.alto;
        const occupiedVolume = sector.puestos.reduce((acc, puesto) => {
            if (puesto.estadoLleno) {
                return acc + (puesto.largo * puesto.ancho * puesto.alto);
            }
            return acc;
        }, 0);

        return (occupiedVolume / totalVolume) * 100;
    };

    if (loading) return <p>Cargando detalles de la bodega...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!warehouseData) return null;

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{warehouseData.descripcion}</h2>

            {/* Info básica */}
            <div className="mb-4">
                <p><strong>Dirección:</strong> {warehouseData.direccion}</p>
                <p><strong>Teléfono:</strong> {warehouseData.telefono}</p>
                <p><strong>Ciudad:</strong> {warehouseData.ciudad?.nombre}</p>
                <p><strong>Tipo:</strong> {warehouseData.tipoBodega?.nombre}</p>
            </div>

            {/* Sectores */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Sectores</h3>
                {warehouseData.sectores?.length > 0 ? (
                    warehouseData.sectores.map((sector) => (
                        <div key={sector.id} className="mb-4 p-4 border rounded-md bg-gray-50">
                            <p><strong>Nombre:</strong> {sector.nombre}</p>
                            <p><strong>Descripción:</strong> {sector.descripcion}</p>
                            <p><strong>Dimensiones:</strong> {`${sector.largo} x ${sector.ancho} x ${sector.alto}`}</p>

                            {/* Mostrar porcentaje de espacio ocupado */}
                            <p><strong>Espacio Ocupado:</strong> {calculateOccupiedSpace(sector).toFixed(2)}%</p>

                            {/* Puestos */}
                            <h4 className="mt-2 font-medium">Puestos</h4>
                            {sector.puestos?.length > 0 ? (
                                <ul className="list-disc pl-5">
                                    {sector.puestos.map((puesto) => (
                                        <li key={puesto.id}>
                                            {puesto.descripcion} - Fila {puesto.fila}, Columna {puesto.columna}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">Este sector no tiene puestos aún.</p>
                            )}

                            {/* Agregar puesto */}
                            <div className="mt-2">
                                {/* Inputs para agregar puesto (sin cambios) */}
                                <input
                                    type="text"
                                    placeholder="Descripción del puesto"
                                    value={newPuestos[sector.id]?.descripcion || ''}
                                    onChange={(e) =>
                                        setNewPuestos((prev) => ({
                                            ...prev,
                                            [sector.id]: { ...prev[sector.id], descripcion: e.target.value },
                                        }))
                                    }
                                    className="border rounded px-2 py-1 mr-2 mb-1"
                                />
                                <input
                                    type="number"
                                    placeholder="Fila"
                                    value={newPuestos[sector.id]?.fila || ''}
                                    onChange={(e) =>
                                        setNewPuestos((prev) => ({
                                            ...prev,
                                            [sector.id]: { ...prev[sector.id], fila: e.target.value },
                                        }))
                                    }
                                    className="border rounded px-2 py-1 mr-2 mb-1 w-20"
                                />
                                <input
                                    type="number"
                                    placeholder="Columna"
                                    value={newPuestos[sector.id]?.columna || ''}
                                    onChange={(e) =>
                                        setNewPuestos((prev) => ({
                                            ...prev,
                                            [sector.id]: { ...prev[sector.id], columna: e.target.value },
                                        }))
                                    }
                                    className="border rounded px-2 py-1 mr-2 mb-1 w-20"
                                />
                                <input
                                    type="number"
                                    placeholder="Largo"
                                    value={newPuestos[sector.id]?.largo || ''}
                                    onChange={(e) =>
                                        setNewPuestos((prev) => ({
                                            ...prev,
                                            [sector.id]: { ...prev[sector.id], largo: e.target.value },
                                        }))
                                    }
                                    className="border rounded px-2 py-1 mr-2 mb-1 w-24"
                                />
                                <input
                                    type="number"
                                    placeholder="Ancho"
                                    value={newPuestos[sector.id]?.ancho || ''}
                                    onChange={(e) =>
                                        setNewPuestos((prev) => ({
                                            ...prev,
                                            [sector.id]: { ...prev[sector.id], ancho: e.target.value },
                                        }))
                                    }
                                    className="border rounded px-2 py-1 mr-2 mb-1 w-24"
                                />
                                <input
                                    type="number"
                                    placeholder="Alto"
                                    value={newPuestos[sector.id]?.alto || ''}
                                    onChange={(e) =>
                                        setNewPuestos((prev) => ({
                                            ...prev,
                                            [sector.id]: { ...prev[sector.id], alto: e.target.value },
                                        }))
                                    }
                                    className="border rounded px-2 py-1 mr-2 mb-1 w-24"
                                />
                                <label className="inline-flex items-center mb-1 mr-2">
                                    <input
                                        type="checkbox"
                                        checked={newPuestos[sector.id]?.estadoLleno || false}
                                        onChange={(e) =>
                                            setNewPuestos((prev) => ({
                                                ...prev,
                                                [sector.id]: { ...prev[sector.id], estadoLleno: e.target.checked },
                                            }))
                                        }
                                        className="mr-1"
                                    />
                                    Lleno
                                </label>
                                <button
                                    onClick={() => handleAddPuesto(sector.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    Agregar Puesto
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Esta bodega no tiene sectores registrados.</p>
                )}
            </div>

           
            {/* Agregar nuevo sector */}
            <div className="mb-6 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-semibold mb-2">Agregar Nuevo Sector</h3>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={newSector.nombre}
                    onChange={(e) => setNewSector({ ...newSector, nombre: e.target.value })}
                    className="border rounded px-2 py-1 mr-2 mb-2"
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={newSector.descripcion}
                    onChange={(e) => setNewSector({ ...newSector, descripcion: e.target.value })}
                    className="border rounded px-2 py-1 mr-2 mb-2"
                />
                <input
                    type="number"
                    placeholder="Largo"
                    value={newSector.largo}
                    onChange={(e) => setNewSector({ ...newSector, largo: e.target.value })}
                    className="border rounded px-2 py-1 mr-2 mb-2 w-24"
                />
                <input
                    type="number"
                    placeholder="Ancho"
                    value={newSector.ancho}
                    onChange={(e) => setNewSector({ ...newSector, ancho: e.target.value })}
                    className="border rounded px-2 py-1 mr-2 mb-2 w-24"
                />
                <input
                    type="number"
                    placeholder="Alto"
                    value={newSector.alto}
                    onChange={(e) => setNewSector({ ...newSector, alto: e.target.value })}
                    className="border rounded px-2 py-1 mr-2 mb-2 w-24"
                />
                <div className="inline-flex items-center mb-2">
                    <label className="mr-2">Estado Lleno:</label>
                    <input
                        type="checkbox"
                        checked={newSector.estadoLleno}
                        onChange={(e) =>
                            setNewSector({ ...newSector, estadoLleno: e.target.checked })
                        }
                        className="mr-2"
                    />
                </div>
                <button
                    onClick={handleAddSector}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    Agregar Sector
                </button>
            </div>

            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
                Cerrar
            </button>
        </div>
    );
};

export default WarehouseModal;
