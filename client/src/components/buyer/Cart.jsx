import React, { useState } from 'react'
import axios from 'axios'

export default function Cart({ cart, setCart, products, setProducts, buyer_id, onOrderPlaced }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    try {
      // Check stock levels before placing the order
      for (const item of cart) {
        const product = products.find(p => p.product_id === item.product_id)
        if (product.stock_level < item.quantity) {
          alert(`Sorry, only ${product.stock_level} ${product.product_name}(s) are available in stock.`)
          return
        }
      }

      const response = await axios.post(`http://localhost:5000/orders/${buyer_id}`, {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        seller_id: cart[0].seller_id, // All items are from the same seller
        payment_method: paymentMethod
      })

      // Update local stock levels
      const updatedProducts = products.map(product => {
        const cartItem = cart.find(item => item.product_id === product.product_id)
        if (cartItem) {
          return { ...product, stock_level: product.stock_level - cartItem.quantity }
        }
        return product
      })
      setProducts(updatedProducts)

      alert("Your order has been placed successfully!")
      // Reset cart and buyer details
      setCart([])
      setIsCheckingOut(false)
      onOrderPlaced()
    } catch (error) {
      console.error('Error placing order:', error)
      alert(error.response?.data?.message || 'Failed to place order. Please try again.')
    }
  }

  return (
    <div className="fixed bottom-0 right-0 m-4 bg-white p-4 rounded-md shadow-md max-w-md max-h-[80vh] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="mb-4 max-h-40 overflow-auto">
            {cart.map((item, index) => (
              <li key={index} className="mb-2 flex justify-between">
                <span>{item.product_name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="font-bold mb-4">Total: ${total.toFixed(2)}</p>
          {isCheckingOut ? (
            <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-300"
              >
                Place Order
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-300"
            >
              Checkout
            </button>
          )}
        </>
      )}
    </div>
  )
}

