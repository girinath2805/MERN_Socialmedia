import { atom } from "recoil";

export const conversationsAtom = atom({
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