import React from 'react'
import axios from 'axios'

export default function ProductList({ products, setEditingProduct, setShowForm, refreshData, seller_id }) {
  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/products/${productId}`, {
          data: { seller_id }
        })
        refreshData()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-4">Product List</h3>
      <ul className='flex flex-wrap justify-around gap-4'>
        {products.map((product) => (
          <li key={product.product_id} className="mb-4 p-4 border border-gray-200 rounded-md w-[33%]">
            <h4 className="font-semibold">{product.product_name}</h4>
            <p className="text-sm text-gray-600">{product.product_description}</p>
            <p className="text-sm">Stock: {product.stock_level}</p>
            <p className="text-sm">Price: ${product.price}</p>
            <div className="mt-2">
              <button
                onClick={() => handleEdit(product)}
                className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.product_id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

