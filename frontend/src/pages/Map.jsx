import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import PostForm from "../components/PostForm";
import { io } from "socket.io-client";
import { needIcon, resourceIcon } from "../utils/markers.js";
import MarkerClusterGroup from "react-leaflet-cluster";
import ChatBox from "../components/ChatBox.jsx";

const Map = () => {
  const [posts, setPosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chatPost, setChatPost] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const chatPostRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const filteredPosts = posts.filter((post) => {
    const matchCategory =
      categoryFilter === "all" || post.category === categoryFilter;
    const matchStatus = statusFilter === "all" || post.status === statusFilter;

    return matchCategory && matchStatus;
  });

  const handleStatusUpdate = async (postId, newStatus) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/post/${postId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)));
    } catch (error) {
      console.log("Failed to update status");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`, {
        params: { lat: latitude, lng: longitude, radius: 50000 },
      });
      setPosts(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_URL}`);

    socket.on("connect", () => {
      console.log("Connected to socket");
      socket.emit("join-zone", "global");
    });

    // socket.on("new-post", (post) => setPosts((prev) =>Array.isArray(prev) ?[post, ...prev]:[post]));

    socket.on("new-post", (post) => {
      setPosts((prev) => (Array.isArray(prev) ? [post, ...prev] : [post]));

      // Show toast notification
      setToast(`New ${post.type} posted: ${post.category}`);
      setTimeout(() => setToast(null), 3000);
    });

    socket.on("update-post", (updatedPost) => {
      setPosts((prev) =>
        Array.isArray(prev)
          ? prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
          : [],
      );
    });

    socket.on("new-message", ({ postId, message }) => {
      if (chatPostRef.current?._id === postId) {
        setChatMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenChat = (post) => {
    setChatPost(post);
    setChatMessages(post.message || []);
    chatPostRef.current = post;
  };

  const handleSendMessage = async (text) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/${chatPost._id}/messages`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      console.log("Failed to send message");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      {/* Navbar */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-bold text-lg">Disaster Hub</h1>
          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
            {posts.length} posts
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {user?.name} · {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-2 flex items-center gap-3 flex-wrap">
        <span className="text-gray-400 text-xs font-semibold">FILTER:</span>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-800 text-gray-300 text-xs border border-gray-600 rounded px-3 py-1 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="shelter">Shelter</option>
          <option value="medical">Medical</option>
          <option value="rescue">Rescue</option>
          <option value="other">Other</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 text-gray-300 text-xs border border-gray-600 rounded px-3 py-1 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Reset button */}
        <button
          onClick={() => {
            setCategoryFilter("all");
            setStatusFilter("all");
          }}
          className="text-gray-500 hover:text-white text-xs transition"
        >
          Reset
        </button>

        {/* Filtered count */}
        <span className="text-gray-600 text-xs ml-auto">
          Showing {filteredPosts.length} of {posts.length} posts
        </span>
      </div>

      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-gray-800 border border-gray-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex-1">
        {userLocation ? (
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MarkerClusterGroup>
              {filteredPosts?.map((post) => (
                <Marker
                  key={post._id}
                  position={[
                    post.location.coordinates[1],
                    post.location.coordinates[0],
                  ]}
                  icon={post.type === "need" ? needIcon : resourceIcon}
                >
                  <Popup>
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <p className="font-bold capitalize">{post.category}</p>
                      <p className="text-sm">{post.description}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        Type: {post.type}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        Status: {post.status}
                      </p>

                      {/* Only show buttons if user is a volunteer */}
                      {user?.role === "volunteer" && (
                        <div className="flex flex-col gap-1 mt-1">
                          {post.status === "open" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(post._id, "in-progress")
                              }
                              className="bg-yellow-500 text-white text-xs px-2 py-1 rounded"
                            >
                              Claim this need
                            </button>
                          )}
                          {post.status === "in-progress" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(post._id, "resolved")
                              }
                              className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                            >
                              Mark as resolved
                            </button>
                          )}
                          {post.status === "resolved" && (
                            <p className="text-green-600 text-xs font-semibold">
                              ✓ Resolved
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => handleOpenChat(post)}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded mt-1 transition"
                      >
                        Open Chat
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Getting your location...</p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-40 right-4 z-[1000] bg-gray-900 border border-gray-700 rounded-lg p-3">
          <p className="text-gray-400 text-xs font-semibold mb-2">LEGEND</p>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300 text-xs">Need help</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300 text-xs">Can help</span>
          </div>
        </div>

        {/* Floating button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="absolute bottom-6 right-6 z-[1000] bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-full font-semibold shadow-lg transition"
          >
            + New Post
          </button>
        )}

        {/* Post form */}
        {showForm && (
          <PostForm
            userLocation={userLocation}
            onClose={() => setShowForm(false)}
          />
        )}

        {chatPost && (
          <ChatBox
            post={chatPost}
            messages={chatMessages}
            onClose={() => {
              setChatPost(null);
              setChatMessages([]);
              chatPostRef.current = null;
            }}
            onSend={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Map;
