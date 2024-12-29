import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProductList from './ProductList'
import CategoryList from './CategoryList'
import SearchBar from './SearchBar'
import ProductDetails from './ProductDetails'
import Cart from './Cart'
import { useNavigate } from "react-router-dom";
import OrderList from './OrderList'

export default function BuyerDashboard() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [activeSeller, setActiveSeller] = useState(null)
  const [activeSellerName, setActiveSellerName] = useState(null)
  const buyer_id = localStorage.getItem("buyer_id")
  const navigate = useNavigate();


  const logoutHandler = () => {
    localStorage.removeItem("buyer_id");
    navigate("/login");
  };

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchOrders()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert("Failed to fetch products. Please try again.")
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      alert("Failed to fetch categories. Please try again.")
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/buyer/${buyer_id}`)
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert("Failed to fetch orders. Please try again.")
    }
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === 'all' ? null : categoryId)
    setSearchTerm('')
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setSelectedCategory(null)
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
  }

  const handleAddToCart = (product) => {
    if (cart.length > 0 && product.seller_id !== activeSeller) {
      alert("You can only add products from one seller at a time. Please finish your current order or empty your cart before adding products from a different seller.")
      return
    }

    const existingItemIndex = cart.findIndex(item => item.product_id === product.product_id)
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += product.quantity
      setCart(updatedCart)
    } else {
      setCart([...cart, product])
    }

    if (cart.length === 0) {
      setActiveSeller(product.seller_id)
      setActiveSellerName(product.seller_name)
      alert(`You are now shopping from Seller ${product.seller_name}`)
    }
  }

  const handleEmptyCart = () => {
    setCart([])
    setActiveSeller(null)
    setActiveSellerName(null)
    alert("Your cart has been emptied. You can now add products from any seller.")
  }

  const filteredProducts = products.filter((product) => {
    if (activeSeller && product.seller_id !== activeSeller) {
      return false
    }
    if (selectedCategory && selectedCategory !== 'all' && product.category_id !== selectedCategory) {
      return false
    }
    if (searchTerm && !product.product_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-[#fdb5b6] p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-8">
          Buyer's Dashboard
        </h1>
        <button
          onClick={logoutHandler}
          className="mb-4 px-3 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
        >
          Logout
        </button>
      </div>
      {activeSeller && (
        <div className="mb-4 p-4 bg-pink-100 rounded-md">
          <p className="text-pink-800">You are currently shopping from Seller {activeSellerName}</p>
          <button
            onClick={handleEmptyCart}
            className="mt-2 bg-pink-500 text-white py-1 px-2 rounded-md hover:bg-pink-600 transition duration-300"
          >
            Empty Cart & Change Seller
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <CategoryList 
            categories={categories} 
            onSelectCategory={handleCategorySelect} 
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="md:col-span-3">
          <SearchBar onSearch={handleSearch} />
          <ProductList products={filteredProducts} onSelectProduct={handleProductSelect} />
        </div>
      </div>
      {selectedProduct && (
        <ProductDetails product={selectedProduct} onAddToCart={handleAddToCart} onClose={() => setSelectedProduct(null)} />
      )}
      <Cart cart={cart} setCart={setCart} products={products} setProducts={setProducts} buyer_id={buyer_id} onOrderPlaced={fetchOrders} />
      <div className="mt-8 max-w-3xl">
        <h2 className="text-2xl font-semibold text-pink-600 mb-4">My Orders</h2>
        <OrderList orders={orders} fetchOrders={fetchOrders} buyer_id={buyer_id}/>
      </div>
    </div>
  )
}
