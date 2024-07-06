import User, {IUser} from "../models/userModel"
import bcrypt from 'bcryptjs'
import { Response, Request } from "express"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie"
import mongoose from "mongoose"

interface AuthenticatedRequest extends Request{
    user?:IUser | null
}

const signupUser = async(req:Request, res:Response): Promise<void> => {
    try {   
        const { name, email, userName, password } = req.body

        const user = await User.findOne({ $or:[{email}, {userName}] })
        if(user) {
            res.status(400).json({ message:"User already exists"})
            return;
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name, 
            email, 
            password:hashPassword, 
            userName,
        })
        const savedUser = await newUser.save()
        if(savedUser){
            generateTokenAndSetCookie(savedUser._id as mongoose.Schema.Types.ObjectId, res)
            res.status(201).json({
                _id:savedUser._id,
                name:savedUser.name,
                email:savedUser.email,
                userName:savedUser.userName,  
            })
        }
        else{
            res.status(400).json({message: "Invalid user data"})
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message})
        console.log("Error in signup user:", (error as Error).message)
    }
}

const signinUser = async(req:Request, res:Response):Promise<void> => {

    try {
        const { userName, password } = req.body
        const user = await User.findOne({ userName })
        if(!user){
            res.status(404).json({ message: "Username doesn't exist"})
            return
        }
        const isPasswordCorrect = await bcrypt.compare(password, user?.password)

        if(!isPasswordCorrect) {
            res.status(401).json({ message: "Invalid credentials"})
            return
        }

        generateTokenAndSetCookie(user._id as mongoose.Schema.Types.ObjectId, res)

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            userName:user.userName,
        })

    } catch (error) {
        res.status(500).json({ message: (error as Error).message})
        console.error("Error signing in user :", error)
    }
}

const signoutUser = async(req:Request, res:Response):Promise<void> => {
    try {
        res.cookie("token", "", { maxAge:1 })
        res.status(200).json({ message:"User signed out successfully!" })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message})
        console.log("Error in signing out user:", (error as Error).message)
    }
}

const followUnfollowUser = async(req:AuthenticatedRequest, res:Response):Promise<void> => {
    try {
        const { id } = req.params;
        const currentUserId = req.user?._id as mongoose.Types.ObjectId;
        const targetId = new mongoose.Types.ObjectId(id);

        if (currentUserId.equals(targetId)){
            res.status(400).json({ message: "You cannot follow/unfollow yourself" });
            return;
        }

        const [targetUser, currentUser] = await Promise.all([
            User.findById(targetId),
            User.findById(currentUserId)
        ])

        if (!currentUser || !targetUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (currentUser.following?.includes(targetId)) {
            // Unfollow
            await Promise.all([
                User.findByIdAndUpdate(currentUserId, { $pull: { following: targetId } }),
                User.findByIdAndUpdate(targetId, { $pull: { followers: currentUserId } })
            ]);
            res.status(200).json({ message: "Unfollowed successfully" });
        } 
        else {
            // Follow
            await Promise.all([
                User.findByIdAndUpdate(currentUserId, { $push: { following: targetId } }),
                User.findByIdAndUpdate(targetId, { $push: { followers: currentUserId } })
            ]);
            res.status(200).json({ message: "Followed successfully" });
        }

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
        console.log("Error in follow/unfollow user:", (error as Error).message);
    }
}

export {signupUser, signinUser, signoutUser, followUnfollowUser}