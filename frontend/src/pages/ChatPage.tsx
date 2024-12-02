import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import Conversation from '../components/Conversation'
import { GiConversation } from 'react-icons/gi'
import MessageContainer from '../components/MessageContainer'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useShowToast from '../hooks/UseShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'
import { IConversation } from '../types'
import axiosInstance from '../api/axiosInstance'

const ChatPage = () => {
    const { showToast } = useShowToast();
    const [isLoading, setIsLoading] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const currentUser = useRecoilValue(userAtom)
    const [searchText, setSearchText] = useState("")
    const [isSearching, SetIsSearching] = useState(false);
    const { socket, onlineUsers } = useSocket() || { socket: null, onlineUsers: [] }

    useEffect(() => {
        socket?.on("messagesSeen", ({conversationId}) => {
            setConversations((prevConv:any) => {
                const updatedConversations = prevConv.map((conversation:any) => {
                    if(conversation._id === conversationId){
                        return {
                            ...conversation,
                            lastMessage:{
                                ...conversation.lastMessage,
                                seen:true
                            }
                        }
                    }
                    return conversation
                }) 
                return updatedConversations
            })
        })
    }, [socket, setConversations])

    useEffect(() => {
        const getConversations = async () => {
            try {
                const response = await axiosInstance.get('/api/messages/conversations');
                if (response.data.error) {
                    showToast({
                        title: 'Error',
                        description: response.data.error,
                        status: 'error',
                    });
                } else {
                    setConversations(response.data);
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
                setIsLoading(false);
            }
        }

        getConversations();

    }, [setConversations])

    const handleConversationSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        SetIsSearching(true);
        try {
            const response = await axiosInstance.get(`/api/users/profile/${searchText}`);
            if (response.data.error) {
                showToast({
                  title: 'Error',
                  description: response.data.error,
                  status: 'error',
                });
                return;
            } else {

                const searchedUser = response.data.user

                const messagingYourself = searchedUser._id === currentUser?._id
                if(messagingYourself){
                    showToast({
                        description: "You cannot message yourselves", 
                        status: 'warning',
                    })
                    return;
                }

                const conversationAlreadyExists = conversations.find((conversation: any) => 
                    conversation.participants.some((participant: any) => participant._id === searchedUser._id)
                );
                
                if (conversationAlreadyExists) {
                    setSelectedConversation({
                        _id: conversationAlreadyExists._id,
                        userId: searchedUser._id,
                        userName: searchedUser.userName,
                        userProfilePic: searchedUser.profilePic,
                        mock:false,
                    });
                    return;
                }

                const mockConversation = {
                    mock:true,
                    lastMessage:{
                        text:"",
                        sender:"",
                    },
                    _id:Date.now(),
                    participants:[
                        {
                        _id:searchedUser._id,
                        userName:searchedUser.userName,
                        profilePic:searchedUser.profilePic
                        }
                    ]
                }

                setConversations((prevConv) => {
                    const updatedConversations = [...prevConv, mockConversation];
                    return updatedConversations;
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
        } finally {
            SetIsSearching(false)
        }
    }

    return (
        <Box
            position={"absolute"}
            left={"50%"}
            w={{
                base: "100%",
                md: "80%",
                lg: "750px"
            }}
            p={4}
            transform={"translateX(-50%)"}
        >
            <Flex
                gap={4}
                flexDirection={{
                    base: "column",
                    md: "row",
                }}
                maxW={{
                    base: "400px",
                    md: "full",
                }}
                mx={"auto"}
            >
                <Flex
                    flex={30}
                    flexDirection={"column"}
                    maxW={{
                        sm: "250px",
                        md: "full"
                    }}
                    mx={"auto"}
                    gap={2}
                >
                    <Text
                        fontWeight={700}
                        color={useColorModeValue("gray.600", "gray.400")}
                    >
                        Your conversations
                    </Text>
                    <form onSubmit={handleConversationSearch}>
                        <Flex
                            alignItems={"center"}
                            gap={2}
                        >
                            <Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
                            <Button size={"sm"} onClick={handleConversationSearch} isLoading={isSearching}>
                                <SearchIcon />
                            </Button>
                        </Flex>
                    </form>
                    {isLoading && (
                        [0, 1, 2, 3, 4, 5].map((_, i) => (
                            <Flex
                                key={i}
                                gap={4}
                                alignItems={"center"}
                                borderRadius={"md"}
                                p={1}
                            >
                                <Box>
                                    <SkeletonCircle size={"10"} />
                                </Box>
                                <Flex
                                    w={"full"}
                                    flexDirection={"column"}
                                    gap={3}
                                >
                                    <Skeleton h={"10px"} w={"80px"} />
                                    <Skeleton h={"8px"} w={"90%"} />
                                </Flex>
                            </Flex>
                        ))
                    )}

                    {!isLoading && conversations && conversations.map((conversation:IConversation) => (
                        <Conversation 
                        key={conversation._id} 
                        isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                        conversation={conversation} 
                        />
                    ))}

                </Flex>
                {!selectedConversation._id && (
                    <Flex
                        flex={70}
                        borderRadius={"md"}
                        p={2}
                        flexDir={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        height={"400px"}
                    >
                        <GiConversation size={100} />
                        <Text fontSize={20}>Select a conversation to start messaging</Text>
                    </Flex>
                )}

                {selectedConversation._id && (
                    <MessageContainer />
                )}
            </Flex>
        </Box>
    )
}

export default ChatPage
