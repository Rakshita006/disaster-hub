import express from 'express'
import authMiddleware from '../middleware/auth.js'
import Post from '../models/Post.js'

const router=express.Router()

router.post('/',authMiddleware,async(req,res)=>{
  try {
    const {type, category, latitude, longitude, description}= req.body
  
    const post= await Post.create({
      type,
      category,
      description,
      author: req.user.id,
      location:{
        type:'Point',
        coordinates: [longitude, latitude]
      }
    })
  
    req.io.emit('new-post',post)
    res.status(201).json(post)
  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
})

router.get('/', async(req,res)=>{
  try {
    const {lat, lng, radius}=req.query

    const posts = await Post.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'distance',
          maxDistance: parseInt(radius) || 10000,
          spherical: true
        }
      }
    ]);

    res.json(posts);
  } catch (error) {
     res.status(500).json({ message: err.message });
  }
})

router.patch('/:id/status', authMiddleware, async(req,res)=>{
  try {
    const {status}=req.body

    const post=await Post.findByIdAndUpdate(
      req.params.id,
      {status},
      {new:true}
    )

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    req.io.emit('update-post',post)

    res.json(post)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

// Send a message on a post
router.post('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          messages: {
            sender: req.user.id,
            senderName: req.user.name,
            text
          }
        }
      },
      { new: true }
    );

    const newMessage = post.messages[post.messages.length - 1];

    // Emit to everyone
    req.io.emit('new-message', {
      postId: post._id,
      message: newMessage
    });

    res.json(newMessage);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router