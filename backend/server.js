import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from'dotenv'
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js'
import http from 'http'
import {Server} from 'socket.io'

dotenv.config()

const app=express()
const httpServer=http.createServer(app)

const allowedOrigins = [
  'http://localhost:5173',
  'https://disaster-hub-inky.vercel.app'
];

const io=new Server(httpServer,{
  cors:{
    origin:allowedOrigins,
    methods: ['GET', 'POST']
  }
})

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH']
}));

app.use(express.json())

app.use((req,res,next)=>{
  req.io=io
  next()
})

io.on('connection', (socket)=>{
  console.log('A user connected', socket.id)

  socket.on('join-zone',(zone)=>{
    socket.join(zone)
    console.log(`User joined zone: ${zone}`)
  })

   socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
})

console.log("ENV TEST:", process.env.JWT_SECRET);
app.get('/',(req,res)=>{
  res.send('Server is running');
})

const PORT= process.env.PORT || 3000

app.use('/api/auth', authRoutes)
app.use('/api/post',postRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log('mongodb connected');
  httpServer.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
    
  })
})
.catch((err)=>console.log(err));