import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { CgMoreO } from "react-icons/cg"
import { IPost, IUser } from "../types"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { Link as RouterLink } from 'react-router-dom'
import { AiOutlineUser } from "react-icons/ai"
import useShowToast from "../hooks/UseShowToast"
import useFollowUnfollow from "../hooks/useFollowUnfollow"


const UserHeader = ({ user, posts }: { user: IUser, posts: IPost[] }) => {

  const { showToast } = useShowToast()
  const { handleFollowUnfollow, isLoading, following } = useFollowUnfollow(user)
  const currentUser = useRecoilValue(userAtom)

  const copyURL = () => {
    const currentURL = window.location.href
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast({
        description: "Copied to Clipboard",
        status: "success"
      })
    })
  }

  return (
    <VStack gap={4} alignItems={'start'}>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={'center'}>
            <Text fontSize={'sm'}>{user?.userName}</Text>
            <Text
              fontSize={'xs'}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={'full'}
            >
              yoink.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            src={user?.profilePic}
            bg={useColorModeValue("", "")}
            icon={!user?.profilePic ? (
              <AiOutlineUser color={useColorModeValue("black", "white")} />
            ) : (
              <></>
            )}
            size={{
              base: "lg",
              md: "xl",
            }}
          />
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
        <Button
          size={'sm'}
          isLoading={isLoading}
          onClick={handleFollowUnfollow}
        >
          {following ? "Unfollow " : "Follow"}
        </Button>
      )}
      <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text color={"gray.light"}>{user?.followers?.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          {user._id === currentUser?._id ? (
            <Text color={"gray.light"}>{user.following?.length} following</Text>
          ) : (
            <Text color={"gray.light"}>{posts.length} posts</Text>
          )}
        </Flex>
        <Flex>
          <Box className="icon-container">
            <Menu>
              <MenuButton><CgMoreO size={24} cursor={"pointer"} /></MenuButton>
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
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={'center'}
          pb={3}
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Posts</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default UserHeader