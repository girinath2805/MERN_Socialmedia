import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import mongoose, { mongo } from "mongoose";
import Post, { IReply } from "../models/postModel";
import uploadToS3 from "../utils/uploadToS3";
import getCloudFrontSignedUrl from "../utils/getSignedUrl";
import deleteFromS3 from "../utils/deletefromS3";
import invalidateCloudFront from "../utils/invalidateUrl";

interface AuthenticatedRequest extends Request{
    user?:IUser | null
}

const createPost = async(req:AuthenticatedRequest, res:Response):Promise<void> => {
    try {
        const { postedBy, text } = req.body
        const post = req.file

        if(!postedBy || !text){
            res.status(400).json({ error:"Postedby and text fields are required" })
            return;
        }

        const user = await User.findById(postedBy)
        if(!user){
            res.status(404).json({ error:"User not found" })
            return;
        }

        const userId = req.user?._id as mongoose.Types.ObjectId

        if(!(user._id as mongoose.Types.ObjectId).equals(userId)){
            res.status(403).json({ error:"Unauthorized to create post" })
            return;
        }

        const maxLength = 500
        if(text.length > maxLength){
            res.status(400).json({ error:`Text must be less than ${maxLength} characters`})
            return;
        }

        let img:string | undefined
        if(post){
            img = await uploadToS3(post, "posts")
        }

        const newPost = new Post({ postedBy, text, img})
        const savedPost = await newPost.save()
        if(savedPost.img){
            savedPost.img = getCloudFrontSignedUrl(savedPost.img, 1)
        }
        res.status(201).json(savedPost)

    } catch (error) {
        res.status(500).json( {error:(error as Error).message })
        console.error("Error in creating post :", error)
    }
}

const getPost = async(req:Request, res:Response):Promise<void> => {
    const { id } = req.params 
    try {
        const post = await Post.findById(id)  
        if(!post){
            res.status(404).json({ error:"Post not found" });
            return;
        }      

        if(post.img){
            post.img = getCloudFrontSignedUrl(post.img, 1); 
        }

        if(post.replies.length > 0){
            post.replies.forEach((reply) => {
                if(reply.userProfilePic){
                    reply.userProfilePic = getCloudFrontSignedUrl(reply.userProfilePic, 1);
                }
            })
        }

        res.status(200).json(post)

    } catch (error) {
        res.status(500).json({ error:(error as Error).message});
    }
}

const deletePost = async(req:AuthenticatedRequest, res:Response):Promise<void> => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if(!post){
            res.status(404).json({ error:"Post not found" })
            return;
        }

        if(!post?.postedBy.equals(req.user?._id as mongoose.Types.ObjectId)){
            res.status(500).json({ error:"Unauthorized to delete the post"})
            return;
        }

        if(post.img){
            await deleteFromS3(post.img);
            await invalidateCloudFront(post.img);
        }

        await Post.findByIdAndDelete(id)
        res.status(201).json({ message:"Post deleted successfully" });

    } catch (error) {
        res.status(500).json({ error:(error as Error).message});
    }
}    

const likeUnlikePost = async(req:AuthenticatedRequest, res:Response):Promise<void> => {

    const { id } = req.params;
    const postId = new mongoose.Types.ObjectId(id);

    try {
        const userId = req.user?._id as mongoose.Schema.Types.ObjectId
        const post = await Post.findById(id);
        if(!post){
            res.status(404).json({ error:"Post not found" });
            return;
        }

        const userLikedPost = post.likes.includes(userId)
        if(userLikedPost){
            await Post.updateOne({_id:postId}, {$pull:{likes:userId}});
            res.status(201).json("Post unliked sucessfully")
        }
        else{
            await Post.updateOne({_id:postId}, {$push:{likes:userId}});
            res.status(201).json("Post liked sucessfully")
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
            res.status(400).json({error:"Text field is required"})
            return;
        }
        const post = await Post.findById(id);
        if(!post){
            res.status(404).json({ error:"Post not found"})
            return;
        }

        const reply:IReply = {userId, text, userProfilePic, userName};
        post.replies.push(reply)
        await post.save()
        res.status(201).json(reply);
        
    } catch (error) {
        res.status(500).json({ error:(error as Error).message});
    }
}

const getFeedPosts = async(req:AuthenticatedRequest, res:Response):Promise<void> => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({ error:"User not found" });
            return;
        }

        if(!user.following){
            res.status(200).json({ message:"No followers"})
        }

        const following = user.following;

        const feedPosts = await Post.find({ postedBy:{ $in:following } }).sort({ createdAt: -1}).exec()

        const signedPosts = feedPosts.map((post) => {
            if(post.img){
                return {...post.toObject(), img:getCloudFrontSignedUrl(post.img, 1)}
            }
            return post.toObject()
        })

        res.status(200).json(signedPosts)

    } catch (error) {
        res.status(500).json({ error:(error as Error).message});
    }
}

const getUserPosts = async(req:Request, res:Response):Promise<void> => {
    const { username } = req.params
    try {
        const user = await User.findOne({ userName:username })
        if(!user){
            res.status(404).json({ error:"User not found"})
            return;
        }

        const posts = await Post.find({ postedBy:user._id}).sort({ createdAt:-1 });
        const signedPosts = posts.map((post) => {
            if(post.img){
                return {...post.toObject(), img:getCloudFrontSignedUrl(post.img, 1)}
            }
            return post.toObject();
        })
        res.status(200).json(signedPosts);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message})
    }
}

export {createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts}