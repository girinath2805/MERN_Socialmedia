import mongoose, {Document} from "mongoose";

export interface IReply{
    userId:mongoose.Types.ObjectId,
    text:string,
    userProfilePic?:string,
    userName?:string,
}

export interface IPost extends Document{
    postedBy:mongoose.Types.ObjectId,
    text?:string,
    img?:string,
    likes:mongoose.Schema.Types.ObjectId[],
    replies:IReply[]
}

const replySchema = new mongoose.Schema({
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
        default:"",
    },
    userName:{
        type:String,
        default:""
    }
}, { timestamps:true });

const postSchema = new mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
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
    replies:{
        type:[replySchema],
        default:[],
    },
}, { timestamps:true })

const Post = mongoose.model<IPost>('Post', postSchema)

export default Post