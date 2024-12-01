import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './UseShowToast';
import axios from 'axios';

const useLogout = () => {

    const setUser = useSetRecoilState(userAtom);
    const { showToast } = useShowToast()
    
    const handleLogout = async () => {
        try {
          const response = await axios.post("/api/users/signout");
          if (response.data.error) {
            showToast({
              title: "Error",
              description: response.data.error,
              status: "error",
            });
          } else {
            console.log(response.data);
            localStorage.removeItem("user-threads");
            setUser(null);
            showToast({
              description: "Successfully signed out.",
              status: "success",
            });
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast({
              title: "Error",
              description: error.response.data.error,
              status: "error",
            });
          } else {
            showToast({
              title: "Error",
              description: "An error occurred during signout. Please try again.",
              status: "error",
            });
          }
        }
      };

      return handleLogout
}

export default useLogout
