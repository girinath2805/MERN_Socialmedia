import { NextFunction, Request, Response } from "express";
import  jwt, { JwtPayload }  from 'jsonwebtoken';
import User, { IUser } from "../models/userModel";

interface AuthenticatedRequest extends Request{
    user?:IUser | null
}

const protectRoute = async(req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> => {
    try {
        const token = req.cookies.token;
        if(!token){
            res.status(401).json({ message:"Unauthorized"})
            return;
        }
        const jwtSecret = process.env.JWT_SECRET
        if(!jwtSecret) throw new Error("JWT Secret is not defined");

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload & {userId:string}
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            res.status(401).json({ message:"Unauthorized: User not found"});
            return;
        }

        req.user = user;
        next();

    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        else{
            res.status(500).json({ message: (error as Error).message });
        }
        console.error("Error in protectRoute:",error)
    }
}

export default protectRoute