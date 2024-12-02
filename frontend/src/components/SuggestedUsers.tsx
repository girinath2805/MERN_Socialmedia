import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser'
import useShowToast from '../hooks/UseShowToast'
import axios from 'axios'
import { IUser } from '../types'
import axiosInstance from '../api/axiosInstance'

const SuggestedUsers = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [suggestedUsers, setSuggestedUsers] = useState<IUser[]>([])
    const { showToast } = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            try {
                const response = await axiosInstance.get("/api/users/suggested");
                if (response.data.error) {
                    showToast({
                        title: 'Error',
                        description: response.data.error,
                        status: 'error',
                    });
                } else {
                    setSuggestedUsers(response.data)
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
                setIsLoading(false);
            }
        }

        getSuggestedUsers()
    }, [])

    return (
        <>
            <Text mb={4} fontWeight={"bold"}>
                SuggestedUsers
            </Text>
            <Flex direction={"column"} gap={4}>
                {isLoading && [0, 1, 2, 3, 4].map((_, i) => (
                    <Flex
                        key={i}
                        gap={2}
                        alignItems={"center"}
                        p={1}
                        borderRadius={"md"}
                    >
                        <Box>
                            <SkeletonCircle size={"10"} />
                        </Box>
                        <Flex w={"full"} flexDirection={"column"} gap={2}>
                            <Skeleton h={"8px"} w={"80px"} />
                            <Skeleton h={"8px"} w={"80px"} />
                        </Flex>
                        <Flex>
                            <Skeleton h={"20px"} w={"60px"} />
                        </Flex>
                    </Flex>
                ))}
                {!isLoading && (
                    suggestedUsers.map(user => <SuggestedUser key={user._id} user={user} />)
                )}
            </Flex>
        </>
    )
}

export default SuggestedUsers
