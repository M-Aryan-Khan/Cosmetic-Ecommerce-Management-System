import React from 'react'

export default function CategoryList({ categories, onSelectCategory, selectedCategory }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul>
        <li className="mb-2">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-2 py-1 rounded-md hover:bg-pink-100 transition duration-300 ${
              selectedCategory === null || selectedCategory === 'all' ? 'bg-pink-200' : ''
            }`}
          >
            All Categories
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.category_id} className="mb-2">
            <button
              onClick={() => onSelectCategory(category.category_id)}
              className={`w-full text-left px-2 py-1 rounded-md hover:bg-pink-100 transition duration-300 ${
                selectedCategory === category.category_id ? 'bg-pink-200' : ''
              }`}
            >
              {category.category_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

