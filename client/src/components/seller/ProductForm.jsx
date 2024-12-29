import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function ProductForm({ editingProduct, setEditingProduct, setShowForm, refreshData, seller_id, categories }) {
  const [product, setProduct] = useState({
    product_name: '',
    product_description: '',
    stock_level: 0,
    price: 0,
    category_id: '',
  })

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct)
    }
  }, [editingProduct])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const productData = { ...product, seller_id }
      if (editingProduct) {
        await axios.put(`http://localhost:5000/products/${editingProduct.product_id}`, productData)
      } else {
        await axios.post('http://localhost:5000/products', productData)
      }
      setProduct({
        product_name: '',
        product_description: '',
        stock_level: 0,
        price: 0,
        category_id: '',
      })
      setEditingProduct(null)
      setShowForm(false)
      refreshData()
    } catch (error) {
      console.error('Error submitting product:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md mb-6">
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
        <input
          type="text"
          value={product.product_name}
          onChange={(e) => setProduct({ ...product, product_name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Description</label>
        <textarea
          value={product.product_description}
          onChange={(e) => setProduct({ ...product, product_description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Stock Level</label>
        <input
          type="number"
          value={product.stock_level}
          onChange={(e) => setProduct({ ...product, stock_level: parseInt(e.target.value) })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Price</label>
        <input
          type="number"
          step="0.01"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Category</label>
        <select
          value={product.category_id}
          onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
      >
        {editingProduct ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  )
}

