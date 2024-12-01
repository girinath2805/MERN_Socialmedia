import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import Message from "./Message"
import MessageInput from "./MessageInput"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import useShowToast from "../hooks/UseShowToast"
import { useRecoilState, useRecoilValue } from "recoil"
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom"
import userAtom from "../atoms/userAtom"
import { useSocket } from "../context/SocketContext"
import messageSound from "../assets/sounds/message.mp3"
import { IMessage } from "../types"


const MessageContainer = () => {
    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const [isLoading, setIsLoading] = useState(false)
    const { showToast } = useShowToast();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const currentUser = useRecoilValue(userAtom)
    const { socket } = useSocket() || { socket: null, onlineUsers: [] };
    const [conversations, setConversations] = useRecoilState(conversationsAtom)
    const messageEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (socket) {
            const handleMessage = (message: any) => {
                console.log(message);
                if (selectedConversation._id === message.conversationId) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                }

                if (!document.hasFocus()) {
                    const sound = new Audio(messageSound);
                    sound.play()
                }

                setConversations((prevConv: any) => {
                    const updatedConversations = prevConv.map((conversation: any) => {
                        if (conversation._id === message.conversationId) {
                            return {
                                ...conversation,
                                lastMessage: {
                                    text: message.text,
                                    sender: message.sender,
                                },
                            };
                        }
                        return conversation;
                    });
                    return updatedConversations;
                });
            };
            socket.on("newMessage", handleMessage);
            return () => {
                socket.off("newMessage", handleMessage);
            };
        }
    }, [socket, selectedConversation]);

    useEffect(() => {
        const lastMessageIsFromOtherUser = (messages.length > 0) && messages[messages.length - 1].sender !== currentUser?._id
        if (lastMessageIsFromOtherUser) {
            socket?.emit("markMessagesAsSeen", {
                conversationId: selectedConversation._id,
                recipientId: selectedConversation.userId,
            })
        }

        socket?.on("messagesSeen", ({ conversationId }) => {
            if (selectedConversation._id === conversationId) {
                setMessages(prev => {
                    const updatedMessages = prev.map((message) => {
                        if (!message.seen) {
                            return {
                                ...message,
                                seen: true,
                            }
                        }
                        return message
                    })
                    return updatedMessages
                })
            }
        })

    }, [socket, currentUser?._id, selectedConversation, messages])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    useEffect(() => {
        const getMessages = async () => {
            if (!selectedConversation) return;
            setIsLoading(true);
            setMessages([]);
            try {
                if (selectedConversation.mock) return;

                const response = await axios.get(`/api/messages/${selectedConversation.userId}`)
                if (response.data.error) {
                    showToast({
                        title: 'Error',
                        description: response.data.error,
                        status: 'error',
                    });
                } else {
                    setMessages(response.data)
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
                setIsLoading(false)
            }
        }
        getMessages();
    }, [selectedConversation.userId, selectedConversation.mock])

    return (
        <Flex
            flex={70}
            bg={useColorModeValue("gray.200", "gray.dark")}
            borderRadius={"md"}
            flexDir={"column"}
            p={2}
        >
            <Flex
                w={"full"}
                h={12}
                alignItems={"center"}
                gap={2}
                ml={1}
            >
                <Avatar
                    src={selectedConversation.userProfilePic}
                    size={"sm"}
                />
                <Text
                    display={"flex"}
                    alignItems={"center"}
                >
                    {selectedConversation.userName}
                    <Image
                        src="/verified.png"
                        w={4}
                        h={4}
                        ml={1} />
                </Text>
            </Flex>
            <Divider />
            <Flex
                flexDir={"column"}
                gap={4}
                my={4}
                height={"400px"}
                overflowY={"auto"}
                p={2}
            >
                {isLoading && (
                    [0, 1, 2, 3, 4, 5].map((_, i) => (
                        <Flex
                            key={i}
                            gap={2}
                            alignItems={"center"}
                            p={1}
                            borderRadius={"md"}
                            alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                        >
                            {i % 2 === 0 && <SkeletonCircle size={"7"} />}
                            <Flex
                                flexDir={"column"}
                                gap={2}>
                                <Skeleton h={"8px"} w={"250px"} borderRadius={"md"} />
                                <Skeleton h={"8px"} w={"250px"} />
                                <Skeleton h={"8px"} w={"250px"} />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={"7"} />}
                        </Flex>
                    ))
                )}

                {!isLoading && (
                    messages.map(message => (
                        <Flex
                            key={message._id}
                            direction={"column"}
                            ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
                        >
                            <Message message={message} ownMessage={currentUser?._id === message.sender} />
                        </Flex>
                    ))
                )}
            </Flex>
            <MessageInput setMessages={setMessages} />
        </Flex>
    )
}

export default MessageContainer
