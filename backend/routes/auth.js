import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import authMiddleware from '../middleware/auth.js';


const router=express.Router();

router.post('/register',async(req,res)=>{
 try {
   const {name,email,password,role}=req.body;
 
   if(!name || !email || !password || !role){
     return res.json({message:'Please enter all your required details'})
   }
 
   const existing= await User.findOne({email})
 
   if(existing){
     return res.status(400).json({message:'Email already registered'})
   }
 
   const hashedpassword=await bcrypt.hash(password,10)

   await User.create({
    name,
    email,
    password: hashedpassword,
    role
   })

   return res.status(200).json({message:'User registered successfully'})
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
})

router.post('/login',async(req,res)=>{
  try {
    const {email,password}=req.body
  
    if(!email || !password){
      return res.json({message:'Please enter all the required details'})
    }
  
    const user=await User.findOne({email})
  
    if(!user){
      return res.status(400).json({message:'Invalid email or password'})
    }
  
    const isMatch=await bcrypt.compare(password,user.password)
  
    if(!isMatch){
      return res.status(400).json({message:'Invalid email or password'})
    }
  
    const token=jwt.sign(
      {id:user._id, role:user.role, name:user.name},
      process.env.JWT_SECRET,
      {expiresIn:'7d'}
    )

    console.log("LOGIN SECRET:", process.env.JWT_SECRET);
  
    res.json({
      token,
      user:{
        id:user._id,
        role:user.role,
        name:user.name
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.get('/protected', authMiddleware, (req,res)=>{
  res.json({
    message: 'You are authorized',
    user: req.user
  });
})

export default router