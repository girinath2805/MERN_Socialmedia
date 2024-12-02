import { Response } from "express"
import jwt from 'jsonwebtoken'
import mongoose from "mongoose"

const generateTokenAndSetCookie = (userId: mongoose.Schema.Types.ObjectId, res: Response): void => {
    const jwtsecret = process.env.JWT_SECRET
    if (!jwtsecret) throw new Error("JWT Secret is not defined")

    try {
        const token = jwt.sign({ userId }, jwtsecret, {
            expiresIn: '15d',
        })
        res.cookie("token", token, {
            httpOnly: true, // This makes it not accessible for the browser to make it secure
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
            sameSite: "none", // CSRF
            secure:process.env.NODE_ENV === 'production',
        })

    } catch (error) {
        console.error("Error generating token and setting cookie", error);
        throw new Error("Could not generate token and set cookie");
    }
}

export default generateTokenAndSetCookie
