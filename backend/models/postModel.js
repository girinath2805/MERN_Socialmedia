const mongoose = require('mongoose')

const replySchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    text:{
        type:String,
        required:true,
    },
    userProfilePic:{
        type:String,
        default:""
    },
    userName:{
        type:String,
        default:""
    }
}, { timestamps:true })

const postSchema = new mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true,
    },
    text:{
        type:String,
        maxLength:500,  
    },
    img:{
        type:String,
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[],
    },
    replies:[replySchema],
    
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema);
module.exports = Post;