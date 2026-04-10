import mongoose, { model } from "mongoose";

const postSchema=new mongoose.Schema({
  type:{type:String, enum:['need','resource']},
  category:{type:String, enum:['food','shelter','medical','rescue','other']},
  description:String,
  status:{type:String, enum:['open','in-progress','resolved'],default:'open'},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  location:{
    type: {type:String, default:'Point'},
    coordinates:[Number]
  },
  messages: [
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }
]
},{timestamp:true})

postSchema.index({location: '2dsphere' })

export default mongoose.model('Post', postSchema)