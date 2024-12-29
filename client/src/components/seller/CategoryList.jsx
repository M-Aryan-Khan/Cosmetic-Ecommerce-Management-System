import React from 'react'
import axios from 'axios'

export default function CategoryList({ categories, setEditingCategory, setShowForm, refreshData }) {
  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`http://localhost:5000/categories/${categoryId}`)
        refreshData()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-4">Category List</h3>
      <ul className='flex flex-wrap justify-around gap-4'>
        {categories.map((category) => (
          <li key={category.category_id} className="mb-4 p-4 border border-gray-200 rounded-md w-[25%]">
            <h4 className="font-semibold">{category.category_name}</h4>
            <div className="mt-2">
              <button
                onClick={() => handleEdit(category)}
                className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.category_id)}
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

