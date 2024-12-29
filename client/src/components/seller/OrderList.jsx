import React, { useState } from 'react'
import axios from 'axios'

export default function OrderList({ orders, fetchOrders }) {
  const [expandedOrder, setExpandedOrder] = useState(null)

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}/status`, {
        status: newStatus,
        seller_id: localStorage.getItem("seller_id")
      })
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert(error.response?.data?.message || 'Failed to update order status. Please try again.')
    }
  }

  const handleShippingUpdate = async (orderId, shippingData) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}/shipping`, shippingData)
      fetchOrders()
    } catch (error) {
      console.error('Error updating shipping status:', error)
      alert(error.response?.data?.message || 'Failed to update shipping status. Please try again.')
    }
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-4">Order List</h3>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id} className="mb-4 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Order #{order.order_id}</h4>
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.order_id ? null : order.order_id)}
                className="text-blue-500 hover:text-blue-700"
              >
                {expandedOrder === order.order_id ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            {expandedOrder === order.order_id && (
              <div className="mt-4">
                <p>Order Items: {order.order_items}</p>
                <p>Amount: ${order.total_amount}</p>
                <p>Buyer: {order.buyer_name}</p>
                <p>Email: {order.email}</p>
                <p>Phone: {order.phone_number}</p>
                <p>Address: {order.address}</p>
                <p>Order Status: {order.order_status}</p>
                <p>Shipping Status: {order.shipping_status}</p>
                {order.tracking_number && <p>Tracking Number: {order.tracking_number}</p>}
                {order.estimated_delivery_date && <p>Estimated Delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}</p>}
                {order.order_status === 'Pending' && (
                  <div className="mt-4">
                    <h5 className="font-semibold">Update Order Status:</h5>
                    <select
                      onChange={(e) => handleStatusUpdate(order.order_id, e.target.value)}
                      value={order.order_status}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
                {order.order_status === 'Completed'  && (
                  <div className="mt-4">
                    <h5 className="font-semibold">Update Shipping:</h5>
                    <input
                      type="text"
                      placeholder="Tracking Number"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={order.tracking_number || ''}
                      onChange={(e) => handleShippingUpdate(order.order_id, { ...order, tracking_number: e.target.value })}
                    />
                    <input
                      type="date"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={order.estimated_delivery_date || ''}
                      onChange={(e) => handleShippingUpdate(order.order_id, { ...order, estimated_delivery_date: e.target.value })}
                    />
                  </div>
                )}
                {order.rating && (
                  <div className="mt-4">
                    <h5 className="font-semibold">Customer Feedback:</h5>
                    <p>Rating: {order.rating} star{order.rating !== 1 ? 's' : ''}</p>
                    <p>Review: {order.review}</p>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}