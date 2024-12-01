import { atom } from "recoil";
import { IPost } from "../types";

const postsAtom = atom<IPost[]>({
    key:'postsAtom',
    default:[],
})

export default postsAtom;