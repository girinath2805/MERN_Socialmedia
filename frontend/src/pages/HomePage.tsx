import { useEffect, useState } from "react"
import axios from "axios"
import useShowToast from "../hooks/UseShowToast"
import { Box, Flex, Text } from "@chakra-ui/react"
import { Triangle } from "react-loader-spinner"
import Post from "../components/Post"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"
import SuggestedUsers from "../components/SuggestedUsers"



const HomePage = () => {
  const { showToast } = useShowToast()
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useRecoilState(postsAtom)

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
  }, [setPosts])

  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {isLoading ? (
          <Flex
            w={'full'}
            h={'70vh'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Triangle
              width="full"
              height="full"
              color="white"
            />
          </Flex>
        ) : (posts.length == 0 ? (
          <Text>Follow some users</Text>
        ) : (
          <>
            {posts.map((post, index) => (
              <Post post={post} key={index} />
            ))}
          </>
        ))}
      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block"
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  )
}

export default HomePage
