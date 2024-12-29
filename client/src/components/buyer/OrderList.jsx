import React, { useState } from "react";
import axios from "axios";

export default function OrderList({ orders, fetchOrders, buyer_id }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, review: "" });

  const handleFeedbackSubmit = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/orders/feedback/${buyer_id}`, {
        order_id: parseInt(orderId, 10),
        ...feedback,
      });
      fetchOrders();
      setFeedback({ rating: 5, review: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit feedback. Please try again."
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-4">Order List</h3>
      <ul>
        {orders.map((order) => (
          <li
            key={order.order_id}
            className="mb-4 p-4 border border-gray-200 rounded-md"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Order #{order.order_id}</h4>
              <button
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order.order_id ? null : order.order_id
                  )
                }
                className="text-blue-500 hover:text-blue-700"
              >
                {expandedOrder === order.order_id
                  ? "Hide Details"
                  : "Show Details"}
              </button>
            </div>
            {expandedOrder === order.order_id && (
              <div className="mt-4">
                <p>Order Items: {order.order_items}</p>
                <p>Amount: ${order.total_amount}</p>
                <p>Seller: {order.seller_name}</p>
                <p>Order Status: {order.order_status}</p>
                <p>Shipping Status: {order.shipping_status}</p>
                {order.tracking_number && (
                  <p>Tracking Number: {order.tracking_number}</p>
                )}
                {order.estimated_delivery_date && (
                  <p>
                    Estimated Delivery:{" "}
                    {new Date(
                      order.estimated_delivery_date
                    ).toLocaleDateString()}
                  </p>
                )}
                {order.shipping_status === "Delivered" &&
                  order.order_status !== "Pending" &&
                  !order.rating && (
                    <div className="mt-4">
                      <h5 className="font-semibold">Leave Feedback:</h5>
                      <select
                        value={feedback.rating}
                        onChange={(e) =>
                          setFeedback({
                            ...feedback,
                            rating: parseInt(e.target.value),
                          })
                        }
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} Star{rating !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={feedback.review}
                        onChange={(e) =>
                          setFeedback({ ...feedback, review: e.target.value })
                        }
                        placeholder="Write your review here..."
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows="3"
                      ></textarea>
                      <button
                        onClick={() => handleFeedbackSubmit(order.order_id)}
                        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}
                {order.rating && (
                  <div className="mt-4">
                    <h5 className="font-semibold">Your Feedback:</h5>
                    <p>
                      Rating: {order.rating} star{order.rating !== 1 ? "s" : ""}
                    </p>
                    <p>Review: {order.review}</p>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
