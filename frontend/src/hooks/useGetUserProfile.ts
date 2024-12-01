import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import useShowToast from './UseShowToast';
import { IUser } from '../types';

const useGetUserProfile = () => {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(false);  
  const { username } = useParams();
  const { showToast } = useShowToast()

  useEffect(() => {
    const getUser = async() => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/users/profile/${username}`)
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
        } finally {
            setIsLoading(false);
        }
    }

    getUser();

  }, [username])

  return { user, isLoading };

}

export default useGetUserProfile
