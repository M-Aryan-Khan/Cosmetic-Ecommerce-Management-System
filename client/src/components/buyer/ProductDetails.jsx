import React, { useState } from "react";

export default function ProductDetails({ product, onAddToCart, onClose }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity > product.stock_level) {
      alert(`Sorry, only ${product.stock_level} items are available in stock.`);
      return;
    }
    onAddToCart({ ...product, quantity });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md w-[33%] xl:w-[25%]">
        <p>Product Name:</p>
        <h2 className="text-2xl font-semibold mb-4">{product.product_name}</h2>
        <p>Description:</p>
        <p className="text-gray-600 mb-4">{product.product_description}</p>
        <p>Seller Name:</p>
        <p className="text-gray-600 mb-4">{product.seller_name}</p>
        <p>Category:</p>
        <p className="text-gray-600 mb-4">{product.category_name}</p>
        <p>Price:</p>
        <p className="text-xl font-bold mb-4">${product.price}</p>
        <p className="mb-4">In Stock: {product.stock_level}</p>
        <div className="flex items-center mb-4">
          <label htmlFor="quantity" className="mr-2">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={product.stock_level}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(
                  1,
                  Math.min(product.stock_level, parseInt(e.target.value) || 1)
                )
              )
            }
            className="border rounded px-2 py-1 w-16"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleAddToCart}
            className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-300"
            disabled={product.stock_level === 0}
          >
            {product.stock_level === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
