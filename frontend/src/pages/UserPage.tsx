import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom"
import axios from "axios"
import useShowToast from "../hooks/UseShowToast"
import { User } from "../atoms/userAtom"
import { Triangle } from "react-loader-spinner"
import { Flex } from "@chakra-ui/react"
import NotFound404 from "./NotFound404"

export interface IUser extends User {
  following: string[],
  followers: string[]
}

const UserPage = () => {
  const [user, setUser] = useState<IUser | null>(null)
  const { showToast } = useShowToast()
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(true)
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
            description: 'An error occurred while getting user profile. Please try again.',
            status: 'error',
          });
        }
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

  }, [username])

  return (
    <>
      {!user ? (
        isLoading ? (
        <Flex w={'full'} h={'70vh'} justifyContent={'center'} alignItems={'center'}>
          <Triangle width="full" height="full" color="white"/>
        </Flex>) : (
          <Flex justifyContent={'center'}>
            <NotFound404/>
          </Flex>
          
        )
      ) : (
        <>
          <UserHeader user={user} />
          <UserPost likes={1200} replies={500} postImg={'/post1.png'} postTitle={"Let's talk about threads"} />
          <UserPost likes={1200} replies={500} postImg={'/post1.png'} postTitle={"Let's talk about threads"} />
          <UserPost likes={1200} replies={500} postTitle={"Let's talk about threads"} />
        </>
      )}
    </>
  )
}

export default UserPage