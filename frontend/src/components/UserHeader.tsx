import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { IUser } from "../pages/UserPage"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { AiOutlineUser } from "react-icons/ai"
import { useState } from "react"
import axios from "axios"
import useShowToast from "../hooks/UseShowToast"


const UserHeader = ({ user}:{ user:IUser | null}) => {

  const navigate = useNavigate()
  const { showToast }  = useShowToast()
  const currentUser = useRecoilValue(userAtom) 
  const [following, setFollowing] = useState(currentUser ? user?.followers.includes(currentUser._id) : false)
  const [isLoading, setIsLoading ] = useState<boolean>(false)
  const copyURL = () => {
    const currentURL = window.location.href
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast({
        description:"Copied to Clipboard", 
        status:"success"
      })
    })
  }

  const handleFollow = async() => {

    if(!currentUser){
      showToast({
        description:"Signin to continue",
        status:"info",
      })
      setTimeout(() => {
        navigate('/auth')
      })
      return;
    }
    setIsLoading(true)
    try {
      const response = await axios.post(`/api/users/follow/${user?._id}`)

      if (response.data.error) {
        showToast({
          title: 'Error',
          description: response.data.error,
          status: 'error',
        });
      } else {
        if(following){
          showToast({description:`Unfollowed ${user?.name}`, status:"success"})
          user?.followers.pop()
        }
        else{
          showToast({ description:`Following ${user?.name}`, status:"success"})
          user?.followers.push(currentUser?._id)
        }
        setFollowing(!following)
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showToast({
          title: 'Error',
          description: error.response.data.error,
          status: 'error',
        });
      } else {
        showToast({
          title: 'Error',
          description: 'An error occurred while getting user profile. Please try again.',
          status: 'error',
        });
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack gap={4} alignItems={'start'}>
        <Flex justifyContent={'space-between'} w={'full'}>
          <Box>
            <Text fontSize={'2xl'} fontWeight={'bold'}>
              {user?.name}
            </Text>
            <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'sm'}>{ user?.userName }</Text>
              <Text
              fontSize={'xs'}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={'full'}
              >
                threads.net
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar src={user?.profilePic} bg={useColorModeValue("", "")} icon={!user?.profilePic ? <AiOutlineUser color={useColorModeValue("black","white")}/> : <></>} size={
              {
                base:"lg",
                md:"xl",
              }
            }/>
          </Box>
        </Flex>
        <Text>
          {user?.bio}
        </Text>
        {currentUser?._id === user?._id ? (
          <Link as={RouterLink} to="/update">
          <Button size={'sm'}>Edit</Button>
          </Link>
        ) : (
          <Button size={'sm'} isLoading={isLoading} onClick={handleFollow}>{ following ? "Unfollow " : "Follow" }</Button>
        )}
        <Flex w={'full'} justifyContent={'space-between'}>
          <Flex gap={2} alignItems={'center'}>
            <Text color={"gray.light"}>{user?.followers.length} followers</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>instagram.com</Link>
          </Flex>
          <Flex>
            <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"}/>
            </Box>
            <Box className="icon-container">
              <Menu>
                <MenuButton><CgMoreO size={24} cursor={"pointer"}/></MenuButton>
                <Portal>
                  <MenuList bg={'gray.dark'}>
                    <MenuItem bg={'gray.dark'} onClick={copyURL}>Copy Link</MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>
        <Flex w={'full'}>
          <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={'center'} pb={3} cursor={'pointer'}>
            <Text fontWeight={'bold'}>Threads</Text>
          </Flex>
          <Flex flex={1} borderBottom={"1.5px solid gray"} justifyContent={'center'} pb={3} cursor={'pointer'} color={'gray.light'}>
            <Text fontWeight={'bold'}>Replies</Text>
          </Flex>
        </Flex>
    </VStack>
  )
}

export default UserHeader