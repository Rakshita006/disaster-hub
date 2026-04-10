import jwt from 'jsonwebtoken'

const authMiddleware=(req,res,next)=>{
  try {
    const token=req.headers.authorization?.split(' ')[1]

    
    console.log("HEADER:", req.headers.authorization);
    console.log("TOKEN:", token);
    

    if(!token){
      return res.status(401).json({ message: 'No token, access denied' });
    }
  
    const decoded=jwt.verify(token, process.env.JWT_SECRET)

    console.log("SECRET:", process.env.JWT_SECRET);
    console.log("DECODED:", decoded);
    req.user=decoded

    console.log("MIDDLEWARE SECRET:", process.env.JWT_SECRET);
  
    next()
  } catch (error) {
     console.log("JWT ERROR:", error.message)
    res.status(401).json({ message: 'Invalid token' });
  }
}

export default authMiddleware;