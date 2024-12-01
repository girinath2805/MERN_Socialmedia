import { Button, Text } from '@chakra-ui/react'
import useShowToast from '../hooks/UseShowToast';
import axios from 'axios';
import useLogout from '../hooks/useLogout';

const SettingsPage = () => {

    const { showToast } = useShowToast();
    const logout = useLogout();

    const handleFreezeAccount = async () => {
        if (!window.confirm("Are you sure you want to freeze your account?")) return;
        try {
            const response = await axios.put('/api/users/freeze');
            if (response.data.error) {
                showToast({
                    title: 'Error',
                    description: response.data.error,
                    status: 'error',
                });
            } else {
                await logout();
                showToast({
                    description: "Your account has been frozen",
                    status: "success"
                })
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

    return (
        <>
            <Text my={1} fontWeight={"bold"}>
                Freeze Your Account
            </Text>
            <Text my={2}>
                You can unfreeze your account anytime by logging in.
            </Text>
            <Button size={"sm"} bg={"red"} _hover={{ bg: "red.500" }} mt={1} onClick={handleFreezeAccount}>
                Freeze
            </Button>
        </>
    )
}

export default SettingsPage
