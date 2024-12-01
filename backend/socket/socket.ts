import { Server } from "socket.io";
import http from 'http'
import express from 'express'
import Message from "../models/messageModel";
import Conversation from "../models/conversationModel";

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

export const getRecipientSocketId = (recipientId: string) => {
    return userSocketMap[recipientId];
}

const userSocketMap: { [key: string]: any } = {}

io.on("connection", (socket) => {
    console.log("User connected", socket.id)
    const userId = socket.handshake.query.userId as string
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    socket.on("markMessagesAsSeen", async ({ conversationId, recipientId }) => {
        try {
            await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } })
            await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } })
            io.to(userSocketMap[recipientId]).emit("messagesSeen", { conversationId })
        } catch (error) {
            console.log(error)
        }
    })
    socket.on("disconnect", () => {
        console.log("user disconnected",)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export { io, server, app }