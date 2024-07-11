import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import mongoose, { mongo } from "mongoose";
import Post, { IReply } from "../models/postModel";

interface AuthenticatedRequest extends Request{
    user?:IUser | null
}

const createPost = async(req:AuthenticatedRequest, res:Response):Promise<void> => {
    try {
        const { postedBy, text, img } = req.body

        if(!postedBy || !text){
            res.status(400).json({ message:"Postedby and text fields are required" })
            return;
        }

        const user = await User.findById(postedBy)
        if(!user){
            res.status(404).json({ message:"User not found" })
            return;
        }

        const userId = req.user?._id as mongoose.Types.ObjectId

        if(!(user._id as mongoose.Types.ObjectId).equals(userId)){
            res.status(403).json({ message:"Unauthorized to create post" })
            return;
        }

        const maxLength = 500
        if(text.length > maxLength){
            res.status(400).json({ message:`Text must be less than ${maxLength} characters`})
            return;
        }

        const newPost = new Post({ postedBy, text, img})
        const savedPost = await newPost.save()
        res.status(201).json({ message:"Post created successfully!", savedPost})

    } catch (error) {
        res.status(500).json( {message:(error as Error).message })
        console.error("Error in creating post :", error)
    }
}

const getPost = async(req:Request, res:Response):Promise<void> => {
    const { id } = req.params 
    try {
        const post = await Post.findById(id)  
        if(!post){
            res.status(404).json({ message:"Post not found" });
            return;
        }      

        res.status(200).json({ post })

    } catch (error) {
        res.status(500).json({ message:(error as Error).message});
    }
}

const deletePost = async(req:AuthenticatedRequest, res:Response):Promise<void> => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if(!post){
            res.status(404).json({ message:"Post not found" })
            return;
        }

        if(post?.postedBy !== req.user?._id){
            res.status(500).json({ message:"Unauthorized to delete the post"})
            return;
        }

        await Post.findByIdAndDelete(id)
        res.status(201).json({ message:"Post deleted successfully" });

    } catch (error) {
        res.status(500).json({ message:(error as Error).message});
    }
}  

const likeUnlikePost = async(req:AuthenticatedRequest, res:Response):Promise<void> => {

    const { id } = req.params;
    const postId = new mongoose.Types.ObjectId(id);

    try {
        const userId = req.user?._id as mongoose.Schema.Types.ObjectId
        const post = await Post.findById(id);
        if(!post){
            res.status(404).json({ message:"Post not found" });
            return;
        }

        const userLikedPost = post.likes.includes(userId)
        if(userLikedPost){
            await Post.updateOne(postId, {$pull:{likes:userId}});
            res.status(201).json({ message:"Post unliked sucessfully" })
        }
        else{
            await Post.updateOne(postId, {$push:{likes:userId}});
            res.status(201).json({ message:"Post liked sucessfully" })
        }

    } catch (error) {
        res.status(500).json({ message:(error as Error).message});
    }
}

const replyToPost = async(req:AuthenticatedRequest, res:Response):Promise<void> => {

    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const userProfilePic = req.user?.profilePic;
    const userName = req.user?.userName;
    
    try {
        if(text.length === 0){
            res.status(400).json({message:"Text field is required"})
            return;
        }
        const post = await Post.findById(id);
        if(!post){
            res.status(404).json({ message:"Post not found"})
            return;
        }

        const reply:IReply = {userId, text, userProfilePic, userName};
        post.replies.push(reply)
        await post.save()
        res.status(201).json({ message:"Reply added successfully", post });
        
    } catch (error) {
        res.status(500).json({ message:(error as Error).message});
    }
}

const getFeedPosts = async(req:AuthenticatedRequest, res:Response):Promise<void> => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({ message:"User not found" });
            return;
        }

        const following = user.following;

        const feedPosts = await Post.find({ postedBy:{ $in:following } }).sort({ createdAt: -1}).exec()
        res.status(200).json({ feedPosts })

    } catch (error) {
        res.status(500).json({ message:(error as Error).message});
    }
}

export {createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts}