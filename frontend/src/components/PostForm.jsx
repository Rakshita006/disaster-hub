import React from 'react'
import { useState } from 'react'
import axios from 'axios';

const PostForm = ({userLocation, onPostCreated, onClose}) => {

  const [type,setType]=useState('need')
  const [category, setCategory]=useState('food')
  const [description,setDescription]=useState('')
  const [error,setError]=useState('')
  const [loading, setLoading]=useState(false)

  const token=localStorage.getItem('token')

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      const res=await axios.post('http://localhost:5000/api/post',{
        type,
        category,
        description,
        latitude:userLocation[0],
        longitude:userLocation[1]
      },
    {
      headers: {Authorization: `Bearer ${token}` }
    })

    
    onClose();
    } catch (error) {
      setError('Failed to create post');
    }finally {
      setLoading(false);
    }
  }
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* Type */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('need')}
              className={`flex-1 py-2 rounded text-sm font-medium transition ${
                type === 'need'
                  ? 'bg-red-800 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              I Need Help
            </button>
            <button
              type="button"
              onClick={() => setType('resource')}
              className={`flex-1 py-2 rounded text-sm font-medium transition ${
                type === 'resource'
                  ? 'bg-green-800 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              I Can Help
            </button>
          </div>
           <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-gray-400"
          >
            <option value="food">Food</option>
            <option value="shelter">Shelter</option>
            <option value="medical">Medical</option>
            <option value="rescue">Rescue</option>
            <option value="other">Other</option>
          </select>

          {/* Description */}
          <textarea
            placeholder="Describe your situation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-gray-400 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Submit Post'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default PostForm