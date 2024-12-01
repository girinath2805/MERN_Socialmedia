import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  HStack,
  Link,
  FormErrorMessage
} from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import { useState } from 'react';
import axios from 'axios';
import useShowToast from '../hooks/UseShowToast';

const ForgotPassword = () => {
  const { showToast } = useShowToast()
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  const isValidEmail = (value: string): boolean => {
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleForgotPassword = async () => {
    // Reset error state
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email address");
      return;
    }

    try {
      const response = await axios.post('/api/users/forgot-password', { email })
      if (response.data.error) {
        showToast({
          title: "Error",
          description: response.data.error,
          status: "error",
        })
      } else {
        console.log(response.data);
        showToast({
          description: "An email has been sent to reset password",
          status: "success"
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showToast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
        })
      } else {
        showToast({
          title: "Error",
          description: "An error occurred during signup. Please try again.",
          status: "error",
        });
      }
    }

  };

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
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          You'll get an email with a reset link
        </Text>
        <FormControl id="email" my={2} isInvalid={!!error} isRequired>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'#0047AB'}
            color={'white'}
            _hover={{
              bg: '#191970',
            }}
            onClick={handleForgotPassword}
          >
            Request Reset
          </Button>
        </Stack>
        <HStack justifyContent={'space-between'}>
          <Link color={'blue.400'} onClick={() => setAuthScreen("signin")}>Already a user?</Link>
          <Link color={'blue.400'} onClick={() => setAuthScreen("signup")}>Don't have an account?</Link>
        </HStack>
      </Stack>
    </Flex>
  );
}

export default ForgotPassword;
