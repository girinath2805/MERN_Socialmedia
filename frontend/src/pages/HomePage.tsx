import { useEffect, useState } from "react"
import axios from "axios"
import useShowToast from "../hooks/UseShowToast"
import { Flex, Text } from "@chakra-ui/react"
import { Triangle } from "react-loader-spinner"
import Post from "../components/Post"



const HomePage = () => {
  const { showToast } = useShowToast()
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getFeedPosts = async () => {
      try {
        const response = await axios.get('/api/posts/feed/')
        if (response.data.error) {
          showToast({
            title: "Error",
            description: response.data.error,
            status: "error",
          })
        } else {
          console.log(response.data);
          setPosts(response.data);
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
            description: 'An error occurred while getting feed posts. Please try again.',
            status: 'error',
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    getFeedPosts()
  }, [])

  return (
    <>
      {isLoading ? (
        <Flex w={'full'} h={'70vh'} justifyContent={'center'} alignItems={'center'}>
          <Triangle width="full" height="full" color="white" />
        </Flex>
      ) : (posts.length == 0 ? (
        <Text>Follow some users</Text>
      ) : (
        <>
          {posts.map((post, index) => (
            <Post post={post} key={index}/>
          ))}
        </>
      ))}
    </>
  )
}

export default HomePage
