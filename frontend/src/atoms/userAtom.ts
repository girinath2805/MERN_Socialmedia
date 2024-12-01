// userAtom.ts
import { atom } from 'recoil';
import { IUser } from '../types';

const getUserFromLocalStorage = (): IUser | null => {
  const storedUser = localStorage.getItem('user-threads');
  return storedUser ? JSON.parse(storedUser) : null;
};

const userAtom = atom<IUser | null>({
  key: 'userAtom',
  default: getUserFromLocalStorage(),
});

export default userAtom;
