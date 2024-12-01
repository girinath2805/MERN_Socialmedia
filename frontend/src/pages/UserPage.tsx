import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom"
import axios from "axios"
import useShowToast from "../hooks/UseShowToast"
import { Triangle } from "react-loader-spinner"
import { Flex, Text } from "@chakra-ui/react"
import NotFound404 from "./NotFound404"
import Post from "../components/Post"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"
import { IUser, IPost } from "../types"

const UserPage = () => {
  const [user, setUser] = useState<IUser | null>(null)
  const { showToast } = useShowToast()
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/api/users/profile/${username}`)
        if (response.data.error) {
          showToast({
            title: 'Error',
            description: response.data.error,
            status: 'error',
          });
        } else {
          if (response.data.user.isFrozen) {
            setUser(null);
            return;
          }
          setUser(response.data.user)
          getPosts(response.data.user.userName);
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

    const getPosts = async (userName: string) => {
      setIsFetching(true);
      try {
        const response = await axios.get("/api/posts/user/" + userName)
        if (response.data.error) {
          showToast({
            title: 'Error',
            description: response.data.error,
            status: 'error',
          });
        } else {
          console.log(response.data);
          setPosts(response.data)
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
        setIsFetching(false);
      }
    }

    getUser();
  }, [username, setPosts])

  return (
    <>
      {!user ? (
        isLoading ? (
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
        ) : (
          <Flex justifyContent={'center'}>
            <NotFound404 />
          </Flex>
        )
      ) : (
        <>
          <UserHeader user={user} posts={posts} />
          {!isFetching && posts.length === 0 && (
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              mt={24}
            >
              <Text fontWeight={"bold"}>No posts yet</Text>
            </Flex>
          )}
          {isFetching && (
            <Flex
              w={'full'}
              justifyContent={'center'}
              alignItems={'center'}
              p={5}
            >
              <Triangle
                color="white"
                height="250"
                width="220"
              />
            </Flex>
          )}
          {!isFetching && posts.length !== 0 && posts.map((post: IPost) => (
            <Post key={post._id} post={post} />
          ))}
        </>
      )}
    </>
  )
}

export default UserPage