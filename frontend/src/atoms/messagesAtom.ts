import { atom } from "recoil";
import { IConversation } from "../types";

export const conversationsAtom = atom<IConversation[]>({
    key:"conversationsAtom",
    default:[],
})

export const selectedConversationAtom = atom({
    key:"selectedConversationAtom",
    default:{
        _id:"",
        userId:"",
        userName:"",
        userProfilePic:"",
        mock:false
    }
})