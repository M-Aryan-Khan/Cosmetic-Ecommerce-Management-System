import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import CategoryForm from "./CategorForm";
import CategoryList from "./CategoryList";
import { useNavigate } from "react-router-dom";
import OrderList from './OrderList'

export default function Dashboard() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const seller_id = localStorage.getItem("seller_id");
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("seller_id");
    navigate("/login");
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/products/seller/${seller_id}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/orders/${seller_id}`)
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOrders();
  }, []);

  const refreshData = () => {
    fetchProducts();
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-[#fdb5b6] p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-8">
          Seller's Dashboard
        </h1>
        <button
          onClick={logoutHandler}
          className="mb-4 px-3 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">
            Products
          </h2>
          <button
            onClick={() => setShowProductForm(!showProductForm)}
            className="mb-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
          >
            {showProductForm ? "Hide Form" : "Add New Product"}
          </button>
          {showProductForm && (
            <ProductForm
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              setShowForm={setShowProductForm}
              refreshData={refreshData}
              seller_id={seller_id}
              categories={categories}
            />
          )}
          <ProductList
            products={products}
            setEditingProduct={setEditingProduct}
            setShowForm={setShowProductForm}
            refreshData={refreshData}
            seller_id={seller_id}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">
            Categories
          </h2>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="mb-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
          >
            {showCategoryForm ? "Hide Form" : "Add New Category"}
          </button>
          {showCategoryForm && (
            <CategoryForm
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              setShowForm={setShowCategoryForm}
              refreshData={refreshData}
            />
          )}
          <CategoryList
            categories={categories}
            setEditingCategory={setEditingCategory}
            setShowForm={setShowCategoryForm}
            refreshData={refreshData}
          />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-pink-600 mb-4">Orders</h2>
        <OrderList orders={orders} fetchOrders={fetchOrders} />
      </div>
    </div>
  );
}
