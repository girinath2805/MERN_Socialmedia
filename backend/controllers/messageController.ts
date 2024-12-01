import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import Conversation from "../models/conversationModel";
import Message from "../models/messageModel";
import mongoose from "mongoose";
import { getRecipientSocketId, io } from "../socket/socket";
import uploadToS3 from "../utils/uploadToS3";
import getCloudFrontSignedUrl from "../utils/getSignedUrl";

interface AuthenticatedRequest extends Request {
    user?: IUser | null
}

const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { recipientId, message } = req.body;
        const img = req.file;
        const senderId = req.user?.id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        })

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })

            await conversation.save();
        }

        let imgUrl = "";

        if(img){
            imgUrl = await uploadToS3(img, "message-pics")
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            img:imgUrl
        })

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            }),
        ])

        if(newMessage.img){
            newMessage.img = getCloudFrontSignedUrl(newMessage.img, 1);
        }

        const recipientSocketId = getRecipientSocketId(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("newMessage", newMessage)
        }
        
        res.status(201).json(newMessage)

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    const { otheruserid } = req.params;
    const userId = req.user?._id;

    try {
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otheruserid] }
        })

        if (!conversation) {
            res.status(404).json("Conversation not found")
        }

        const messages = await Message.find({
            conversationId: conversation?._id
        }).sort({ createdAt: 1 })

        const signedMessages = messages.map((message) => {
            if(message.img){
                return {...message.toObject(), img:getCloudFrontSignedUrl(message.img, 1)};
            }
            return message.toObject();
        })

        res.status(200).json(signedMessages);

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

const getConversations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    const userId = req.user?._id as mongoose.Types.ObjectId;

    try {

        const conversations = await Conversation.find({
            participants: userId
        }).populate({
            path: "participants",
            select: "userName profilePic",
        });

        const filteredConversations = conversations.map((conversation) => {
            const participants = conversation.participants.filter(
                (participant: any) => participant._id.toString() !== userId.toString()
            ).map((participant:any) => ({
                ...participant.toObject(),
                profilePic:getCloudFrontSignedUrl(participant.profilePic, 1)
            }));
            return { ...conversation.toObject(), participants };
        });

        res.status(200).json(filteredConversations);

    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export { sendMessage, getMessages, getConversations }