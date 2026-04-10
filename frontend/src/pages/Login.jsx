import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const navigate=useNavigate()

  const handleLogin=async(e)=>{
    e.preventDefault();
    try {
      const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      })

      localStorage.setItem('token',res.data.token)
      localStorage.setItem('user',JSON.stringify(res.data.user))

      navigate('/map')

    } catch (error) {
      setError('Invalid error or password')
    }
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md border border-gray-700">

        <h1 className="text-white text-2xl font-bold mb-2">
          Disaster Hub
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Coordinate relief efforts in real time
        </p>

         {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-gray-400"
          />
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-gray-300 hover:underline">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login