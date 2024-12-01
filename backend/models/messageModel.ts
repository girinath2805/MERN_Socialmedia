import mongoose, { Document } from 'mongoose'

export interface IMessage extends Document{
    conversationId:mongoose.Types.ObjectId,
    sender:mongoose.Types.ObjectId,
    text:string,
    img:string,
    seen:boolean,
}

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation'
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    text:{
        type:String,
        default:"",
    },
    img:{
        type:String,
        default:"",
    },
    seen:{
        type:Boolean,
        default:false,
    },
}, { timestamps:true })

const Message = mongoose.model<IMessage>("Message", messageSchema)
export default Message