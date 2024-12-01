import { Flex, Text, Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormControl, FormErrorMessage, Textarea, useDisclosure } from "@chakra-ui/react"
import { ChangeEvent, useState } from 'react'
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/UseShowToast";
import axios from "axios";
import postsAtom from "../atoms/postsAtom";
import { IPost } from "../types";

const MAX_CHAR = 500

const Actions = ({ post }: { post: IPost }) => {
	const user = useRecoilValue(userAtom)
	const { showToast } = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom)
	const [liked, setLiked] = useState<boolean>(post.likes?.includes(user?._id ?? "") ?? false);
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
				if (!liked) {
					const updatedPosts = posts.map((p: IPost) => {
						if (p._id === post._id) {
							return { ...p, likes: [...p.likes, user._id] }
						}
						return p;
					})
					setPosts(updatedPosts)
				} else {
					const updatedPosts = posts.map((p: IPost) => {
						if (p._id === post._id) {
							return { ...p, likes: p.likes.filter((id) => id !== user._id) }
						}
						return p;
					})
					setPosts(updatedPosts);
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

	const handleReply = async () => {

		if (!user) {
			showToast({
				description: "You must be logged in to like the post",
				status: "error"
			});
			return;
		}

		if (isReplying) return;
		setIsReplying(true);

		setError("")
		if (replyText.length === 0) {
			setError("Content is required")
			return
		}

		try {
			const response = await axios.put(`/api/posts/reply/${post._id}`, {
				text: replyText
			})

			if (response.data.error) {
				showToast({
					title: "Error",
					description: response.data.error,
					status: "error",
				})
			} else {
				showToast({
					description: "Replied to the post",
					status: "success"
				})
				const updatedPosts = posts.map((p: IPost) => {
					if (p._id === post._id) {
						return { ...p, replies: [...p.replies, response.data] };
					}
					return p;
				})
				setPosts(updatedPosts);
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

	if (!post) {
		return <div>Loading...</div>; // Render a loading state until the post data is available
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
			</Flex>

			<Flex gap={2} alignItems={"center"}>
				<Text color={"gray.light"} fontSize='sm'>
					{post.likes.length} likes
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
				<Text color={"gray.light"} fontSize='sm'>
					{post.replies.length} replies
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
