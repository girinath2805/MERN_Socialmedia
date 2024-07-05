import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    profilePic?: string;
    follower?: string[];
    following?: string[];
    bio?: string;
}

const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    follower: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        default: "",
    },
}, { timestamps: true });


const User = mongoose.model<IUser>('User', userSchema);
export default User;