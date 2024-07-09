import User, {IUser} from "../models/userModel"
import bcrypt from 'bcryptjs'
import { Response, Request } from "express"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie"
import mongoose from "mongoose"
import crypto from 'crypto'
import { sendEmail } from "../utils/sendEmail"

interface AuthenticatedRequest extends Request{
    user?:IUser | null
}

const checkAvailability = async(req:Request, res:Response) => {
    const { userName, email } = req.query;

    try {

        const response:{ userNameAvailable?:boolean, emailAvailable?: boolean } = {}
        if(userName){
            const userNameExists = await User.findOne({ userName })
            response.userNameAvailable = !userNameExists
        }
        if(email){
            const emailExists = await User.findOne({ email })
            response.emailAvailable = !emailExists
        }
        res.status(201).json(response);

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
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

        res.status(201).json({
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
        res.status(201).json({ message:"User signed out successfully!" })
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
            res.status(201).json({ message: "Unfollowed successfully" });
        } 
        else {
            // Follow
            await Promise.all([
                User.findByIdAndUpdate(currentUserId, { $push: { following: targetId } }),
                User.findByIdAndUpdate(targetId, { $push: { followers: currentUserId } })
            ]);
            res.status(201).json({ message: "Followed successfully" });
        }

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
        console.log("Error in follow/unfollow user:", (error as Error).message);
    }
}

const updateUser = async(req:AuthenticatedRequest, res:Response):Promise<void> => {
    const {name, email, userName, password, profilePic, bio} = req.body
    if(!req.user){
        res.status(401).json({ message:"Unauthorized"})
        return;
    }
    const userId = req.user?._id

    if(!userId){
        res.status(400).json({ message:"Unauthorized" })
        return;
    }
    
    try {
        let user = await User.findById(userId)
        if(!user){
            res.status(404).json({ message:"User not found" })
            return;
        }

        if (name) user.name = name;

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            user.password = hashPassword
        }

        if(email){
            const existingUserWithEmail = await User.findOne({ email })
            if(existingUserWithEmail){
                res.status(400).json({ message:"Email already taken"})
                return;
            }
            user.email = email;
        }

        if(userName){
            const existingUserWithUserName = await User.findOne({ userName })
            if(existingUserWithUserName){
                res.status(400).json({ message:"Username already taken" })
                return;
            }
            user.userName = userName;
        }

        if (profilePic) user.profilePic = profilePic;
        if (bio) user.bio = bio;

        const savedUser = await user.save()

        res.status(201).json({ message:"Profile updated successfully", user: savedUser})

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
        console.log("Error in updating user:", (error as Error).message);
    }
}

const forgotPassword = async(req:Request, res:Response):Promise<void> => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if(!user){
            res.status(404).json({ message:"User not found" })
            return;
        }
        const token = crypto.randomBytes(32).toString('hex')
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000)
        await user.save();

        const resetUrl = `http://${req.headers.host}/reset-password/${token}`;

        await sendEmail({
            fromEmail: 'giri28may@gmail.com',
            fromName: 'Girinath Chandrakumar',
            toEmail: user.email,
            toName: user.name,
            subject: 'Password Reset Request',
            textPart: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
            htmlPart: `<p>You requested a password reset. Please use the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
            customId: 'PasswordResetRequest'
        });

        res.status(200).json({ message:"Password reset email sent" })

    } catch (error) {
        res.send(500).json({message:(error as Error).message});
        console.error("Error :", error);
    }
}

const resetPassword = async(req:Request, res:Response):Promise<void> => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({ 
            resetPasswordToken:token,
            resetPasswordExpires:{ $gt:Date.now() }
        });

        if(!user){
            res.status(400).json({ message:"Password reset is invalid or has expired" })
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message:"Password has been reset" })
    
    } catch (error) {
        res.send(500).json({message:(error as Error).message});
        console.error("Error :", error);
    }
}

const getUserProfile = async(req:Request, res:Response):Promise<void> => {
    const { userName } = req.params;
    try {
        const user = await User.findOne({ userName }).select("-password").select('-updatedAt')
        if(!user){
            res.status(404).json({ message:"User not found" })
            return;
        }
        res.status(201).json({ user:user })
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
        console.log("Error in updating user:", (error as Error).message);
    }
}

export {signupUser, signinUser, signoutUser, followUnfollowUser, updateUser, checkAvailability, getUserProfile, forgotPassword, resetPassword}