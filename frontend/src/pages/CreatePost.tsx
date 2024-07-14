import { AddIcon } from "@chakra-ui/icons"
import { Button, CloseButton, Flex, FormControl, FormErrorMessage, Image, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { ChangeEvent, useRef, useState } from "react"
import UsePreviewImg from "../hooks/UsePreviewImg"
import { BiImageAdd } from "react-icons/bi"
import axios from "axios"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "../hooks/UseShowToast"

const MAX_CHAR = 500

const CreatePost = () => {
    const { showToast } = useShowToast()
    const user = useRecoilValue(userAtom)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const { handleImgChange, imgUrl, file, setImgUrl, setFile } = UsePreviewImg()
    const imgRef = useRef<HTMLInputElement>(null)
    const [remainingChar, setRemainingChar] = useState<number>(MAX_CHAR)
    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = e.target.value
        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR)
            setPostText(truncatedText)
            setRemainingChar(0)
        }
        else {
            setPostText(inputText)
            setRemainingChar(MAX_CHAR - inputText.length)
        }
    }

    const handleCreatePost = async () => {
        setError("")
        if (postText.length === 0) {
            setError("Content is required")
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.post('/api/posts/create', {
                postedBy: user?._id,
                text: postText,
                post: file
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (response.data.error) {
                showToast({
                    title: "Error",
                    description: response.data.error,
                    status: "error",
                })
            } else {
                console.log(response.data.savedPost);
                showToast({
                    description: "Post created successfully",
                    status: "success"
                })
                onClose()
                setPostText("")
                setFile(null)
                setImgUrl("")
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
                    description: 'An error occurred in creating post. Please try again.',
                    status: 'error',
                });
            }
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={10}
                leftIcon={<AddIcon />}
                bg={useColorModeValue("gray.100", "gray.dark")}
                onClick={onOpen}>
                Post
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
                <ModalOverlay backdropFilter={"blur(3px)"} />
                <ModalContent bg={"gray.dark"}>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isInvalid={!!error}>
                                <Textarea
                                    placeholder="Post content goes here..."
                                    onChange={handleTextChange}
                                    value={postText} />
                                {error && <FormErrorMessage>{error}</FormErrorMessage>}
                            <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.400"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>
                            <Input
                                type="file"
                                hidden
                                ref={imgRef}
                                onChange={handleImgChange} />
                            <BiImageAdd
                                style={{
                                    marginLeft: "5px",
                                    cursor: "pointer",
                                }}
                                fontSize={25}
                                onClick={() => imgRef.current?.click()} />
                        </FormControl>

                        {imgUrl && (
                            <Flex mt={5} w={'full'} position={"relative"} justifyContent={"center"} alignItems={"center"}>
                                <Image src={imgUrl} alt="Selected img" />
                                <CloseButton
                                    onClick={() => {
                                        setImgUrl("")
                                        setFile(null)
                                    }}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2} />
                            </Flex>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={handleCreatePost} isLoading={isLoading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost
