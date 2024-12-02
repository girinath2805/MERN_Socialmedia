import { Avatar, Box, Flex, Image, Text, Tooltip } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Actions from "./Actions"
import useShowToast from "../hooks/UseShowToast"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import { DeleteIcon } from "@chakra-ui/icons"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import postsAtom from "../atoms/postsAtom"
import { IPost, IUser } from "../types"
import axiosInstance from "../api/axiosInstance"

const Post = ({ post }: { post: IPost }) => {
    const { showToast } = useShowToast()
    const [user, setUser] = useState<IUser | null>(null);
    const [posts, setPosts] = useRecoilState(postsAtom)
    const navigate = useNavigate();
    const currentUser = useRecoilValue(userAtom);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axiosInstance.get(`/api/users/profile/${post.postedBy}`)
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

    }, [])

    const handleDeletePost = async () => {
        try {
            if (!window.confirm("Are you sure you want to delete the post?")) return;
            const response = await axiosInstance.delete("/api/posts/" + post._id)
            if (response.data.error) {
                showToast({
                    title: "Error",
                    description: response.data.error,
                    status: "error",
                })
            } else {
                showToast({
                    description: "Post deleted",
                    status: "info"
                })
                setPosts(posts.filter((p) => p._id !== post._id))
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


    return (
        <Link to={`/${user?.userName}/post/${post._id}`}>
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
                            <Text fontSize={'xs'} color={'gray.light'} width={"max-content"} textAlign={"right"}>
                                {formatDistanceToNow(new Date(post.createdAt))}
                            </Text>
                            {currentUser?._id === user?._id && (
                                <Tooltip label="Delete" placement="top" hasArrow bg={"gray.dark"} color={"white"} fontSize={15}
                                    arrowPadding={10} arrowSize={10} padding={2} openDelay={100} rounded={"xl"} px={5}>
                                    <DeleteIcon fontSize={15} color={"red.500"} onClick={(e) => {
                                        e.preventDefault();
                                        handleDeletePost();
                                    }} />
                                </Tooltip>
                            )}
                        </Flex>
                    </Flex>
                    <Text fontSize={'sm'}>{post.text}</Text>
                    {post.img && (
                        <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                            <Image src={post.img} w={'full'} />
                        </Box>
                    )}
                    <Flex>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}

export default Post
