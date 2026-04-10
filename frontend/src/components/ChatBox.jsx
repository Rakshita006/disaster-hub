import { useState } from 'react';
import axios from 'axios';

export default function ChatBox({ post, messages, onClose, onSend }) {
  const [text, setText] = useState('');
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onSend(text);
    setText('');
  };

  // Listen for new messages via socket
  // We will connect this in Map.jsx

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md mx-4 flex flex-col" style={{ height: '500px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <div>
            <p className="text-white font-semibold capitalize">{post.category}</p>
            <p className="text-gray-400 text-xs">{post.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
          {messages.length === 0 && (
            <p className="text-gray-600 text-sm text-center mt-4">
              No messages yet. Start the conversation!
            </p>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.senderName === user.name ? 'items-end' : 'items-start'}`}
            >
              <span className="text-gray-500 text-xs mb-1">{msg.senderName}</span>
              <div
                className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                  msg.senderName === user.name
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="px-4 py-3 border-t border-gray-700 flex gap-2"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm transition"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}