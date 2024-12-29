import React from 'react';
import { useNavigate } from 'react-router-dom';
import header from "../public/header.jpg"
export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdb5b6]">
      <div className="text-center">
        <img
          src={header}
          alt="Cosmetic Logo"
          className="mb-4 w-[40rem]"
        />
        <h1 className="text-4xl font-bold text-pink-600">Glow Cosmetics</h1>
        <p className="text-lg text-balck mt-4">
          Discover the beauty within. Premium cosmetics for every skin type.
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
        >
          Login
        </button>
        <button
          onClick={handleSignup}
          className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-300"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
