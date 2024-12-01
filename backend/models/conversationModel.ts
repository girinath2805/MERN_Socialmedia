import mongoose, { Document } from "mongoose";

export interface IConversation extends Document{
    participants:mongoose.Types.ObjectId[],
    lastMessage:{
        text:string,
        sender:mongoose.Types.ObjectId,
        seen:boolean,
    }
}

const conversationSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    lastMessage:{
        text:String,
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        seen:{
            type:Boolean,
            default:false,
        },
    }
}, {timestamps:true})

const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);
export default Conversation