import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
  Tooltip,
} from '@chakra-ui/react';
import { useState, ChangeEvent } from 'react';
import { ViewIcon, ViewOffIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import axios from 'axios';
import useShowToast from '../hooks/UseShowToast';
import userAtom from '../atoms/userAtom';
import Header from './Header';
import axiosInstance from '../api/axiosInstance';

interface Errors {
  name?: string;
  userName?: string;
  email?: string;
  password?: string;
}

const Signup: React.FC = () => {
  const setUser = useSetRecoilState(userAtom)
  const { showToast } = useShowToast()
  const [name, setName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [userNameAvailable, setUserNameAvailable] = useState<boolean | null>(null);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const handleUserNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserName(value);
    setUserNameAvailable(null); // Reset userNameAvailable state when typing

    try {
      const response = await axios.get(`/api/users/check-availability?userName=${value}`);
      const { userNameAvailable } = response.data;
      setUserNameAvailable(userNameAvailable);
    } catch (error) {
      console.error('Error checking username availability:', error);
    }
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!name) newErrors.name = "Full Name is required";
    if (!userName) newErrors.userName = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!isValidEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const isValidEmail = (value: string): boolean => {
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSignup = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/users/signup", {
        name,
        userName,
        email,
        password,
      });

      if (response.data.error) {
        showToast({
          title: "Error",
          description: response.data.error,
          status: "error",
        })
      } else {
        console.log(response.data);
        localStorage.setItem("user-threads", JSON.stringify(response.data));
        setUser(response.data)
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <Flex align={'center'} justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} px={6} w={'full'}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
          </Stack>
          <Box rounded={'lg'} bg={useColorModeValue('white', '')} boxShadow={'lg'} px={8} pt={5} pb={5} w={'full'}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                {errors.name && <FormErrorMessage p={0}>{errors.name}</FormErrorMessage>}
              </FormControl>

              <FormControl isInvalid={!!errors.userName} isRequired>
                <FormLabel>Username</FormLabel>
                <InputGroup>
                  <Input type="text" value={userName} onChange={handleUserNameChange} />
                  {userName.length > 0 && userNameAvailable !== null && (
                    <InputRightElement>
                      {userNameAvailable === true ? (
                        <Tooltip label="Username available" aria-label='A tooltip' color={"green.500"} bg={"transparent"} placement='right' ml={1}>
                          <CheckCircleIcon color="green.500" />
                        </Tooltip>
                      ) : (
                        <Tooltip label="Username already taken" aria-label='A tooltip' color={"red.500"} bg={"transparent"} placement='right' ml={1}>
                          <WarningIcon color="red.500" />
                        </Tooltip>
                      )}
                    </InputRightElement>
                  )}

                </InputGroup>
                {errors.userName && <FormErrorMessage>{errors.userName}</FormErrorMessage>}
              </FormControl>

              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                  <InputRightElement h={'full'}>
                    <Button variant={'ghost'} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  isLoading={isLoading}
                  onClick={handleSignup}
                  loadingText="Signing up"
                  size="lg"
                  bg={'#0047AB'}
                  color={'white'}
                  _hover={{
                    bg: '#191970',
                  }}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={2}>
                <Text align={'center'}>
                  Already a user? <Link color={'blue.400'} onClick={() => setAuthScreen("login")}>Sign in</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export default Signup;
