const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password:{
        type:String,
        minLength:6,
        required:true,
    },
    profilePic:{
        type:String,
        default:"",
    },
    follower:{
        type:[String],
        default:[],
    },
    following:{
        type:[String],
        default:[],
    },
    bio:{
        type:String,
        default:"",
    },
}, { timestamps:true })

const User = mongoose.model('User',userSchema);
module.exports = User;