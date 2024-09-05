import { Flex, Text, Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, Input, FormErrorMessage, Textarea, useDisclosure } from "@chakra-ui/react"
import { ChangeEvent, useState } from 'react'
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/UseShowToast";
import axios from "axios";

interface IPost {
	_id: string,
	createdAt: string,
	likes: string[],
	postedBy: string,
	replies: {
		userId: string,
		text: string,
		userName: string,
		userProfilePic?: string,
	}[],
	text: string,
	img?: string,
}

const MAX_CHAR = 500

const Actions = ({ post: _post }: { post: IPost }) => {
	const user = useRecoilValue(userAtom)
	const { showToast } = useShowToast();
	const [post, setPost] = useState<IPost>(_post)
	const [liked, setLiked] = useState<boolean>(post.likes.includes(user?._id));
    const [replyText, setReplyText] = useState<string>("")
    const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLiking, setIsLiking] = useState<boolean>(false);
	const [isReplying, setIsReplying] = useState<boolean>(false);
    const [error, setError] = useState<string>("")
    const [remainingChar, setRemainingChar] = useState<number>(MAX_CHAR)

	const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = e.target.value
        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR)
            setReplyText(truncatedText)
            setRemainingChar(0)
        }
        else {
            setReplyText(inputText)
            setRemainingChar(MAX_CHAR - inputText.length)
        }
    }

	const handleLikeUnlike = async () => {
		if (!user) {
			showToast({
				description: "You must be logged in to like the post",
				status: "error"
			});
			return;
		}

		if (isLiking) return;
		setIsLiking(true);
		
		try {
			const response = await axios.put(`/api/posts/like/${post._id}`)
			if (response.data.error) {
				showToast({
					title: "Error",
					description: response.data.error,
					status: "error",
				})
			} else {
				console.log(response.data);
				if (!liked) {
					setPost({ ...post, likes: [...post.likes, user._id] })
				} else {
					setPost({ ...post, likes: post.likes.filter(id => id !== user._id) })
				}

				setLiked(!liked);
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
			setIsLiking(false);
		}
	};

	const handleReply = async() => {

		if (!user) {
			showToast({
				description: "You must be logged in to like the post",
				status: "error"
			});
			return;
		}

		if(isReplying) return;
		setIsReplying(true);

		setError("")
        if (replyText.length === 0) {
            setError("Content is required")
            return
        }

		try {
			const response = await axios.put(`/api/posts/reply/${post._id}`, {
				text:replyText
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
                    description: "Replied to the post",
                    status: "success"
                })
                onClose()
                setReplyText("")
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
			setIsReplying(false);
		}
	}

	return (
		<Flex flexDirection='column'>
			<Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
				<svg
					aria-label='Like'
					color={liked ? "rgb(237, 73, 86)" : ""}
					fill={liked ? "rgb(237, 73, 86)" : "transparent"}
					height='19'
					role='img'
					viewBox='0 0 24 22'
					width='20'
					onClick={handleLikeUnlike}
				>
					<path
						d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
						stroke='currentColor'
						strokeWidth='2'
					></path>
				</svg>

				<svg
					aria-label='Comment'
					color=''
					fill=''
					height='20'
					role='img'
					viewBox='0 0 24 24'
					width='20'
					onClick={onOpen}
				>
					<title>Comment</title>
					<path
						d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
						fill='none'
						stroke='currentColor'
						strokeLinejoin='round'
						strokeWidth='2'
					></path>
				</svg>

				<RepostSVG />
				<ShareSVG />
			</Flex>

			<Flex gap={2} alignItems={"center"}>
				<Text color={"gray.light"} fontSize='sm'>
					{post.replies.length} replies
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
				<Text color={"gray.light"} fontSize='sm'>
					{post.likes.length} likes
				</Text>
			</Flex>
			<Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
                <ModalOverlay backdropFilter={"blur(3px)"} />
                <ModalContent bg={"gray.dark"}>
                    <ModalHeader>Reply to Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isInvalid={!!error}>
                                <Textarea
                                    placeholder="Reply goes here..."
                                    onChange={handleTextChange}
                                    value={replyText} />
                                {error && <FormErrorMessage>{error}</FormErrorMessage>}
                            <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.400"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={handleReply} isLoading={isReplying}>
                            Reply
                        </Button> 
                    </ModalFooter>
                </ModalContent>
            </Modal>
		</Flex>
	)
}

export default Actions

const RepostSVG = () => {
	return (
		<svg
			aria-label='Repost'
			color='currentColor'
			fill='currentColor'
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
		>
			<title>Repost</title>
			<path
				fill=''
				d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
			></path>
		</svg>
	);
};

const ShareSVG = () => {
	return (
		<svg
			aria-label='Share'
			color=''
			fill='rgb(243, 245, 247)'
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
		>
			<title>Share</title>
			<line
				fill='none'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
				x1='22'
				x2='9.218'
				y1='3'
				y2='10.083'
			></line>
			<polygon
				fill='none'
				points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
			></polygon>
		</svg>
	);
};
