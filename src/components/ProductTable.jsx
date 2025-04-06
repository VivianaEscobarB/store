import React, { useState } from 'react';
import MenuModify from './MenuModify'; // Cambiado de ProductRowMenu a MenuModify

const ProductTable = ({ products, onEditProduct, onDeleteProduct }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="mt-6 p-4 border border-gray-300 rounded-md shadow-md bg-white">
      <h3 className="text-lg font-bold text-gray-700 mb-4">Productos Añadidos</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Nombre</th>
            <th className="border border-gray-300 p-2 text-left">Descripción</th>
            <th className="border border-gray-300 p-2 text-left">Precio por unidad</th>
            <th className="border border-gray-300 p-2 text-left">Cantidad</th>
            <th className="border border-gray-300 p-2 text-left">Total</th>
            <th className="border border-gray-300 p-2 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr
                key={index}
                className="relative hover:bg-gray-50"
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">{product.description}</td>
                <td className="border border-gray-300 p-2">${product.unitPrice}</td>
                <td className="border border-gray-300 p-2">{product.quantity}</td>
                <td className="border border-gray-300 p-2">{product.total}</td>
                <td className="border border-gray-300 p-2">{product.date}</td>
                {hoveredRow === index && (
                  <td className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <MenuModify
                      onEdit={() => onEditProduct(index)}
                      onDelete={() => onDeleteProduct(index)}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No hay productos añadidos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
