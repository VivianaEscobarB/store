import React, { useState } from 'react';
import ProductTable from './ProductTable'; // Importa el nuevo componente

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitPrice: '',
    quantity: '', // Cambiado de unitQuantity a quantity
    total: '', // Cambiado de totalQuantity a total
    date: '',
  });

  const [products, setProducts] = useState([]); // Cambia a un array para manejar múltiples productos
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para saber si se está editando
  const [editIndex, setEditIndex] = useState(null); // Índice del producto que se está editando

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Actualiza el producto existente
      const updatedProducts = [...products];
      updatedProducts[editIndex] = formData;
      setProducts(updatedProducts);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Añade un nuevo producto
      setProducts([...products, formData]);
    }
    setFormData({ name: '', description: '', unitPrice: '', quantity: '', total: '', date: '' }); // Limpia el formulario
  };

  const handleEditProduct = (index) => {
    setFormData(products[index]); // Carga los datos del producto en el formulario
    setIsEditing(true); // Cambia a modo edición
    setEditIndex(index); // Guarda el índice del producto que se está editando
  };

  const handleDeleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index)); // Elimina el producto de la lista
  };

  return (
    <>
      <h2 className="text-lg font-bold text-gray-700 mb-4">Añadir Producto</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row flex-wrap gap-6"
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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-sm h-[48px]"
            placeholder="Descripción del producto"
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
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Cantidad</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cantidad"
            required
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total</label>
          <input
            type="number"
            id="total"
            name="total"
            value={formData.total}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Total"
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
            className={`py-3 px-6 rounded-md transition-colors duration-300 w-full md:w-auto cursor-pointer ${
              isEditing
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-[#D1BBFF] text-white hover:bg-[#BFA3E6]'
            }`}
          >
            {isEditing ? 'Guardar Modificación' : 'Añadir Producto'}
          </button>
        </div>
      </form>
      <ProductTable
        products={products}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </>
  );
};

export default AddProductForm;
