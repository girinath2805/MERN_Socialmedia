import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "./UseShowToast"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import { IUser } from "../types"
import axiosInstance from "../api/axiosInstance"

const useFollowUnfollow = (user:IUser) => {

    const currentUser = useRecoilValue(userAtom)
    const { showToast } = useShowToast()
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [following, setFollowing] = useState(currentUser ? user?.followers?.includes(currentUser._id) : false);

    const handleFollowUnfollow = async () => {
        if (!currentUser) {
            showToast({
                description: "Signin to continue",
                status: "info",
            })
            setTimeout(() => {
                navigate('/auth')
            })
            return;
        }

        if(isLoading) return;

        setIsLoading(true)
        try {
            const response = await axiosInstance.post(`/api/users/follow/${user?._id}`)

            if (response.data.error) {
                showToast({
                    title: 'Error',
                    description: response.data.error,
                    status: 'error',
                });
            } else {
                if (following) {
                    showToast({ description: `Unfollowed ${user?.name}`, status: "success" })
                    user?.followers?.pop()
                }
                else {
                    showToast({ description: `Following ${user?.name}`, status: "success" })
                    user?.followers?.push(currentUser?._id)
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
    return { handleFollowUnfollow, isLoading, following }
}

export default useFollowUnfollow
