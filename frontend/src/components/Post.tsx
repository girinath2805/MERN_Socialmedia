import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { BsThreeDots } from "react-icons/bs"
import { useEffect, useState } from "react"
import Actions from "./Actions"
import useShowToast from "../hooks/UseShowToast"
import axios from "axios"
import { IUser } from "../pages/UserPage"
import { formatDistanceToNow } from "date-fns"
 
interface IPost {
    _id: string,
    createdAt: string,
    likes: string[],
    postedBy: string,
    replies: {
        userId:string,
        text:string,
        userName:string,
        userProfilePic?:string,
    }[],
    text: string,
    img?: string,
}

const Post = ({ post }: { post: IPost }) => {
    const { showToast } = useShowToast()
    const [user, setUser] = useState<IUser | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const getUser = async() => {
            try {
                const response = await axios.get(`/api/users/profile/${post.postedBy}`)
                if (response.data.error) {
                    showToast({
                      title: "Error",
                      description: response.data.error,
                      status: "error",
                    })
                  } else {
                    setUser(response.data.user)
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
                      description: 'An error occurred while getting the post. Please try again.',
                      status: 'error',
                    });
                  }
            }
        }

        getUser()

    })


    return (
        <Link to={`${user?.userName}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <Avatar size='md' name={user?.name} src={user?.profilePic}
                        onClick={e => {
                            e.preventDefault();
                            navigate(`/${user?.userName}`);
                        }}
                    />
                    <Box w='1px' h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box position={'relative'} w={'full'}>
                        {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                        {post.replies.length > 0 && post.replies[0].userProfilePic && (
                            <Avatar
                            size={'xs'}
                            name="John Doe"
                            src={post.replies[0].userProfilePic}
                            position={'absolute'}
                            top={'0px'}
                            left={'15px'}
                            padding={'2px'} />
                        )}
                        {post.replies.length > 1 && post.replies[1].userProfilePic && (
                            <Avatar
                            size={'xs'}
                            name="John Doe"
                            src={post.replies[0].userProfilePic}
                            position={'absolute'}
                            bottom={'0px'}
                            right={'-5px'}
                            padding={'2px'} />
                        )}
                        {post.replies.length > 2 && post.replies[2].userProfilePic && (
                            <Avatar
                            size={'xs'}
                            name="John Doe"
                            src={post.replies[0].userProfilePic}
                            position={'absolute'}
                            top={'0px'}
                            left={'4px'}
                            padding={'2px'} />
                        )}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={'column'} gap={2}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text fontSize={'sm'} fontWeight={'bold'} 
                            onClick={e => {
                                e.preventDefault();
                                navigate(`/${user?.userName}`);
                            }}>
                                {user?.name}
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'xs'} color={'gray.light'} width={36} textAlign={"right"}>
                                {formatDistanceToNow(new Date(post.createdAt))}
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text fontSize={'sm'}>{post.text}</Text>
                    {post.img && (
                        <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                            <Image src={post.img} w={'full'} />
                        </Box>
                    )}
                    <Flex>
                        <Actions post={post}/>
                    </Flex>
                    <Flex gap={2} alignItems={'center'}>
                        <Text color={'gray.light'} fontSize={'sm'}>{post.replies.length} replies</Text>
                        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
                        <Text color={'gray.light'} fontSize={'sm'}>{post.likes.length}likes</Text>
                    </Flex>

                </Flex>
            </Flex>
        </Link>
    )
}

export default Post
