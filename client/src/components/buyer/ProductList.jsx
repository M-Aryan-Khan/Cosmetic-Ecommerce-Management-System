import React from "react";

export default function ProductList({ products, onSelectProduct }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.product_id}
          className="bg-white p-4 rounded-md shadow-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <p>Product Name:</p>
            <h3 className="text-lg font-semibold">{product.product_name}</h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <p>Price:</p>
            <p className="text-gray-600">${product.price}</p>
          </div>
          <button
            onClick={() => onSelectProduct(product)}
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-300"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
