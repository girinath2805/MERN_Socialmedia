import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    userName: string;
    email: string;
    password: string;
    profilePic?: string;
    followers?: mongoose.Types.ObjectId[];
    following?: mongoose.Types.ObjectId[];
    bio?: string;
    resetPasswordToken?:string;
    resetPasswordExpires?:Date;
    isFrozen:boolean,
}

const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userName: {
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
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:'User',
        default: [],
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:'User',
        default: [],
    },
    bio: {
        type: String,
        default: "",
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    isFrozen:{
        type:Boolean,
        default:false,
    },
}, { timestamps: true });


const User = mongoose.model<IUser>('User', userSchema);
export default User;