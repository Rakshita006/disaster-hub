# 🚨 Real-Time Disaster Coordination Hub

A full-stack real-time disaster relief platform where victims can post needs and volunteers can offer resources on a live interactive map.

![Disaster Hub](https://disaster-hub-inky.vercel.app)

## 🌐 Live Demo
[https://disaster-hub-inky.vercel.app](https://disaster-hub-inky.vercel.app)

---

## 📌 Features

- 🗺️ **Live Interactive Map** — View all needs and resources on a real-time map powered by Leaflet.js
- 📍 **Geolocation Clustering** — Posts are clustered based on location using MongoDB 2dsphere indexing
- ⚡ **Real-Time Updates** — New posts and status changes appear instantly using Socket.io WebSockets
- 💬 **Live Chat** — Victims and volunteers can chat directly on each post in real time
- 🔴🟢 **Color-Coded Markers** — Red markers for needs, green markers for resources
- 🔍 **Filter Posts** — Filter by category (food, shelter, medical, rescue) and status (open, in-progress, resolved)
- 🔐 **Role-Based Auth** — JWT authentication with separate roles for victims and volunteers
- ✅ **Claim & Resolve** — Volunteers can claim a need and mark it as resolved

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Leaflet.js + react-leaflet
- Socket.io-client
- Axios
- React Router v6

### Backend
- Node.js
- Express.js
- Socket.io
- JWT Authentication
- bcryptjs

### Database
- MongoDB Atlas
- Mongoose
- 2dsphere Geospatial Indexing

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Clone the repository
```bash
git clone https://github.com/Rakshita006/disaster-hub.git
cd disaster-hub
```

### Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Run the server:
```bash
npm run dev
```

### Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env.development` file in the `frontend` folder:

VITE_API_URL=http://localhost:5000

Run the frontend:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

---

## 🔑 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|---|---|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT tokens |
| PORT | Server port (default 5000) |

### Frontend (`frontend/.env.development`)
| Variable | Description |
|---|---|
| VITE_API_URL | Backend API URL |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get JWT token |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/posts | Get posts near a location |
| POST | /api/posts | Create a new post |
| PATCH | /api/posts/:id/status | Update post status |
| POST | /api/posts/:id/messages | Send a chat message |

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| Victim | Create posts, view map, chat |
| Volunteer | View map, claim needs, resolve needs, chat |

---

## 🤝 Contributing

Pull requests are welcome. For major changes please open an issue first to discuss what you would like to change.

---

