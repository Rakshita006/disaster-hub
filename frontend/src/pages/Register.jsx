import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const [name, setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('victim')
  const [error,setError]=useState('')
  const [success,setSuccess]=useState('')

  const navigate=useNavigate()

  const handleRegister=async(e)=>{
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,{
        name,
        email,
        password,
        role
      })

      setSuccess('Account created! Redirecting to login...')

      setTimeout(()=>{
        navigate('/login')
      },2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong')
    }
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md border border-gray-700">

        <h1 className="text-white text-2xl font-bold mb-2">
          Create Account
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Join the relief coordination network
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm mb-4">{success}</p>
        )}

         <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-gray-400"
          />
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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-gray-400"
          >
            <option value="victim">I need help (Victim)</option>
            <option value="volunteer">I want to help (Volunteer)</option>
          </select>

          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded transition"
          >
            Register
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-gray-300 hover:underline">
            Login
          </a>
        </p>
</div>
    </div>
  )
}

export default Register