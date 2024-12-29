import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("buyer");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
  });
  const [error, setError] = useState("");

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/${role}/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setFormData({
        fullname: "",
        email: "",
        password: "",
        phone_number: "",
        address: "",
      });
      if (response.data.success) navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdb5b6]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600">Signup</h1>
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
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-md shadow-md w-[20rem]"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            name="fullname"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your name"
            value={formData.fullname}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone_number"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your phone number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        {role === "buyer" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error} Try again</p>}
        <button
          type="submit"
          className="w-full px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
        >
          Signup as {role}
        </button>
        <p className="text-gray-700 mt-2 text-center">
          If you already have account{" "}
          <a
            href="/Login"
            className="underline-offset-2 underline text-pink-500"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
