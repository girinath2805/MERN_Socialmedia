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
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import useShowToast from '../hooks/UseShowToast'
import axios from 'axios'
import userAtom from '../atoms/userAtom'
import Header from './Header'

interface Errors {
  userName?: string;
  password?: string;
}

const Signin = () => {
  const { showToast } = useShowToast()
  const [showPassword, setShowPassword] = useState(false)
  const setUser = useSetRecoilState(userAtom)
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const [errors, setErrors] = useState<Errors>({});
  const [userName, setUserName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!userName) newErrors.userName = "Username is required";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSignin = async () => {

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true)
    try {
      const response = await axios.post('/api/users/signin', {
        userName,
        password
      })
      if (response.data.error) {
        showToast({
          title: "Error",
          description: response.data.error,
          status: "error",
        })
      } else {
        localStorage.setItem("user-threads", JSON.stringify(response.data));
        setUser(response.data)
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
          description: 'An error occurred during signing in. Please try again.',
          status: 'error',
        });
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
    <Header/>
    <Flex
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={10} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign in to your account
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', '')}
          boxShadow={'lg'}
          p={8}
          w={{
            base: 'full',
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.userName} isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} />
              {errors.userName && <FormErrorMessage>{errors.userName}</FormErrorMessage>}
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
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Link color={'blue.400'} onClick={() => setAuthScreen("forget-password")}>Forgot password?</Link>
              </Stack>
              <Button
                isLoading={isLoading}
                onClick={handleSignin}
                loadingText="Signing in"
                size="lg"
                bg={'#0047AB'}
                color={'white'}
                _hover={{
                  bg: '#191970',
                }}>
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don&apos;t have an account? <Link
                  color={'blue.400'}
                  onClick={() => setAuthScreen("signup")}
                >Sign up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
    </>
  )
}

export default Signin
