// userAtom.ts
import { atom } from 'recoil';

export interface User {
  _id?: string;
  userName?: string;
  name?: string;
  email?: string;
  bio?: string;
  profilePic?: string;
}

const getUserFromLocalStorage = (): User | null => {
  const storedUser = localStorage.getItem('user-threads');
  return storedUser ? JSON.parse(storedUser) : null;
};

const userAtom = atom<User | null>({
  key: 'userAtom',
  default: getUserFromLocalStorage(),
});

export default userAtom;
