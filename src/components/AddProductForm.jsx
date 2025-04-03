import React, { useState } from 'react';

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitPrice: '',
    unitQuantity: '',
    totalQuantity: '',
    date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Producto añadido:', formData);
    // Aquí puedes manejar el envío del formulario, como enviarlo a una API
  };

  return (
   <>
      <h2 className="text-lg font-bold text-gray-700 mb-4">Añadir Producto</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row flex-wrap gap-6 "
      >
        <div className="flex-1 min-w-[250px]">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-sm"
            placeholder="Descripción del producto"
            rows="4"
            required
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">Precio por unidad</label>
          <input
            type="number"
            id="unitPrice"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Precio por unidad"
            required
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label htmlFor="unitQuantity" className="block text-sm font-medium text-gray-700">Cantidad unitaria</label>
          <input
            type="number"
            id="unitQuantity"
            name="unitQuantity"
            value={formData.unitQuantity}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cantidad unitaria"
            required
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label htmlFor="totalQuantity" className="block text-sm font-medium text-gray-700">Cantidad total</label>
          <input
            type="number"
            id="totalQuantity"
            name="totalQuantity"
            value={formData.totalQuantity}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cantidad total"
            required
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex items-end min-w-[250px]">
          <button
            type="submit"
            className="bg-[#D1BBFF] text-white py-3 px-6 rounded-md hover:bg-[#BFA3E6] transition-colors duration-300 w-full md:w-auto cursor-pointer"
          >
            Añadir Producto
          </button>
        </div>
      </form>
      </>
  );
};

export default AddProductForm;
