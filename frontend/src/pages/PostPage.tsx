import { Avatar, Box, Button, Divider, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import userAtom from "../atoms/userAtom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { Triangle } from "react-loader-spinner";
import { useEffect } from "react";
import axios from "axios";
import useShowToast from "../hooks/UseShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { IReply } from "../types";
import axiosInstance from "../api/axiosInstance";


const PostPage = () => {
  const { user, isLoading } = useGetUserProfile();
  const { showToast } = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom)
  const navigate = useNavigate()
  const currentPost = posts[0];


  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const response = await axiosInstance.get(`/api/posts/${pid}`);
        if (response.data.error) {
          showToast({
            title: 'Error',
            description: response.data.error,
            status: 'error',
          });
        } else {
          console.log(response.data); // Log the post data
          setPosts([response.data]); // Set the post data here
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
      }
    }
    getPost();
  }, [pid, setPosts]); // Add dependencies to useEffect

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete the post?")) return;
      const response = await axiosInstance.delete("/api/posts/" + currentPost._id)
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
        navigate(`/${user?.userName}`)
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

  if (!user || !currentPost || isLoading) {
    return (
      <Flex
        w={'full'}
        h={'70vh'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Triangle
          color="white"
          height="300"
          width="250"
        />
      </Flex>
    )
  }

  return (
    <>
      <Flex>
        <Flex
          w={'full'}
          alignItems={'center'}
          gap={3}
        >
          <Avatar
            src={user?.profilePic}
            size={'md'}
            name={user?.name}
          />
          <Flex>
            <Text
              fontSize={'sm'}
              fontWeight={'bold'}
            >
              {user?.userName}
            </Text>
            <Image
              src="/verified.png"
              w={4}
              h={4}
              ml={4}
            />
          </Flex>
        </Flex>
        <Flex
          gap={4}
          alignItems={'center'}
        >
          <Text
            fontSize={'xs'}
            color={'gray.light'}
            width={"max-content"}
            textAlign={"right"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))}
          </Text>
          {currentUser?._id === user?._id && (
            <Tooltip
              label="Delete"
              placement="top"
              hasArrow bg={"gray.dark"}
              color={"white"}
              fontSize={15}
              arrowPadding={10}
              arrowSize={10}
              padding={2}
              openDelay={100}
              rounded={"xl"} px={5}
            >
              <DeleteIcon
                fontSize={15}
                color={"red.500"}
                cursor={"pointer"}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeletePost();
                }}
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>
      <Text my={3}>Let&apos;s talk about threads</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={'hidden'}
          border={'1px solid'}
          borderColor={'gray.light'}
        >
          <Image src={currentPost.img} w={'full'} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        {currentPost ? (
          <Actions post={currentPost} /> // Render Actions only if post is not null
        ) : (
          <Text>Loading post...</Text> // Show a loading message if post is null
        )}
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={'space-between'} >
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👋</Text>
          <Text color={'gray.light'}> Get the app to like, reply and post.</Text>
        </Flex>
        <Button>
          Get
        </Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.length > 0 && currentPost.replies.map((reply: IReply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
        />
      ))}
    </>
  )
}

export default PostPage;