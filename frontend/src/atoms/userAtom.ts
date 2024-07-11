import { atom } from "recoil";

const userAtom = atom({
    key: 'userAtom',
    default: localStorage.getItem("user-threads")
})

export default userAtom