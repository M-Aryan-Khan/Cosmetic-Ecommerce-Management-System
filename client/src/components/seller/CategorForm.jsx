import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function CategoryForm({ editingCategory, setEditingCategory, setShowForm, refreshData }) {
  const [category, setCategory] = useState({
    category_name: '',
  })

  useEffect(() => {
    if (editingCategory) {
      setCategory(editingCategory)
    }
  }, [editingCategory])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await axios.put(`http://localhost:5000/categories/${editingCategory.category_id}`, category)
      } else {
        await axios.post('http://localhost:5000/categories', category)
      }
      setCategory({ category_name: '' })
      setEditingCategory(null)
      setShowForm(false)
      refreshData()
    } catch (error) {
      console.error('Error submitting category:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md mb-6">
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Category Name</label>
        <input
          type="text"
          value={category.category_name}
          onChange={(e) => setCategory({ ...category, category_name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
      >
        {editingCategory ? 'Update Category' : 'Add Category'}
      </button>
    </form>
  )
}

