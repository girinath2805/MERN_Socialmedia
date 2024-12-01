import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import UsePreviewImg from '../hooks/UsePreviewImg'
import useShowToast from '../hooks/UseShowToast'
import axios from 'axios'
import { IUser } from '../types'
import userAtom from '../atoms/userAtom'

interface Inputs extends IUser {
  password?: string,
}

const UpdateProfilePage = () => {
  const { showToast } = useShowToast();
  const [user, setUser] = useRecoilState<IUser | null>(userAtom);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inputs, setInputs] = useState<Inputs>({
    userName: user?.userName,
    name: user?.name,
    email: user?.email,
    bio: user?.bio,
    profilePic: user?.profilePic,
    password: "",
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const { handleImgChange, imgUrl, file, setImgUrl, setFile, } = UsePreviewImg();

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("name", inputs.name || "");
    formData.append("userName", inputs.userName || "");
    formData.append("email", inputs.email || "");
    formData.append("bio", inputs.bio || "");
    if (inputs.password) {
      formData.append("password", inputs.password);
    }
    if (file) {
      formData.append("profilePic", file);
    }

    setIsLoading(true)

    try {
      const response = await axios.put('/api/users/update', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.error) {
        showToast({
          title: "Error",
          description: response.data.error,
          status: "error",
        })
      } else {
        setUser(response.data.user);
        localStorage.setItem("user-threads", JSON.stringify(response.data.user));
        showToast({
          description: 'Profile updated successfully',
          status: 'success',
        });
        setImgUrl("")
        setFile(null)
        setInputs({
          ...inputs,
          profilePic: response.data.user.profilePic
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
          description: 'An error occurred while updating profile. Please try again.',
          status: 'error',
        });
      }
    } finally {
      setIsLoading(false)
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
      >
        <Heading lineHeight={1.1}
          fontSize={{
            base: '2xl',
            sm: '3xl'
          }}
        >
          Edit Profile
        </Heading>
        <FormControl>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar
                size="xl"
                boxShadow={"md"}
                src={imgUrl || user?.profilePic}
                name={user?.name}>
              </Avatar>
            </Center>
            <Center w="full">
              <Button
                w="full"
                onClick={() => fileRef.current?.click()}
              >
                Change Avatar
              </Button>
              <Input
                type='file'
                hidden ref={fileRef}
                onChange={handleImgChange}
              />
            </Center>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input
            value={inputs.name}
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            placeholder="Full Name"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            value={inputs.userName}
            onChange={(e) => setInputs({ ...inputs, userName: e.target.value })}
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            value={inputs.email}
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Input
            value={inputs.bio}
            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            placeholder="Full Name"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='password'
              _placeholder={{ color: 'gray.500' }}
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
            <InputRightElement h={'full'}>
              <Button variant={'ghost'} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.500'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.700',
            }}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onClick={handleUpdateProfile}
            bg={'green.500'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.700',
            }}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default UpdateProfilePage;