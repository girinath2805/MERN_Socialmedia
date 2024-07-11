import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Link,
  FormErrorMessage
} from '@chakra-ui/react';
import axios from 'axios';
import useShowToast from '../hooks/UseShowToast';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate()
  const { showToast } = useShowToast();
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { token } = useParams<{ token: string }>();
  const [resetSuccess, setResetSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleResetPassword = async () => {
    setError('');

    if (!newPassword) {
      setError('New password is required');
      return;
    }
    setIsLoading(true)
    try {
      console.log('Sending new password:', newPassword); // Debug log
      const response = await axios.post(`/api/users/reset-password/${token}`, { newPassword });

      if (response.data.error) {
        showToast({
          title: 'Error',
          description: response.data.error,
          status: 'error',
        });
      } else {
        showToast({
          description: 'Your password has been reset successfully',
          status: 'success',
        });
        setResetSuccess(true)
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
          description: 'An error occurred during password reset. Please try again.',
          status: 'error',
        });
      }
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 2000);
      return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts
    }
  }, [resetSuccess, navigate]);

  return (
    <Flex
      minH={'70vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', '')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Reset Password
        </Heading>
        <FormControl id="new-password" my={2} isInvalid={!!error} isRequired>
          <Input
            isRequired
            placeholder="New password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
        <Stack spacing={6}>
          <Button
            isLoading={isLoading}
            bg={'#0047AB'}
            color={'white'}
            _hover={{
              bg: '#191970',
            }}
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default ResetPassword;
