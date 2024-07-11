import { Button, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/UseShowToast";
import { MdOutlineLogout } from "react-icons/md";

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const { showToast } = useShowToast(); // Destructure showToast here

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

  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      bg={useColorModeValue('','')}
      onClick={handleLogout}
      leftIcon={<MdOutlineLogout fontSize={17}/>}
      _hover={{color:useColorModeValue("white","black"),
        bg:useColorModeValue('black','white')}}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
