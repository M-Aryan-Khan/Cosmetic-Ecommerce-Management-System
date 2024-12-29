import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/${role}/login`, {
        email,
        password,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setEmail("");
      setPassword("");
      if (role === "buyer") {
        const { buyer_id } = res.data.buyer;
        localStorage.setItem("buyer_id", buyer_id);
      } else {
        const { seller_id } = res.data.seller;
        localStorage.setItem("seller_id", seller_id);
      }

      navigate(
        role === "buyer"
          ? "/buyer/dashboard"
          : "/seller/dashboard"
      );
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdb5b6]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600">Login</h1>
      </div>
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => handleRoleChange("buyer")}
          className={`px-6 py-2 rounded-md transition duration-300 ${
            role === "buyer"
              ? "bg-pink-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          Buyer
        </button>
        <button
          onClick={() => handleRoleChange("seller")}
          className={`px-6 py-2 rounded-md transition duration-300 ${
            role === "seller"
              ? "bg-pink-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          Seller
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="bg-white p-6 rounded-md shadow-md w-[20rem]"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
        >
          Login as {role}
        </button>
      </form>
    </div>
  );
}
