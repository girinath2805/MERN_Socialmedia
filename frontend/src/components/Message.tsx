import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { BsCheck2All } from 'react-icons/bs'
import { useState } from 'react'
import { IMessage } from '../types'

interface MessageProps {
    message: IMessage
    ownMessage: boolean,
}

const Message = ({ message, ownMessage }: MessageProps) => {

    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const user = useRecoilValue(userAtom)
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <>
            {ownMessage ? (
                <Flex
                    gap={2}
                    alignSelf={"flex-end"}
                >
                    {message.text && (
                        <Flex
                            bg={"green.800"}
                            maxW={"350px"} p={1}
                            borderRadius={"md"}
                        >
                            <Text color={"white"} px={1}>
                                {message.text}
                            </Text>
                            <Box
                                alignSelf={"flex-end"}
                                ml={1}
                                color={message.seen ? "blue.400" : ""}
                                fontWeight={"bold"}
                            >
                                <BsCheck2All size={16} />
                            </Box>
                        </Flex>
                    )}

                    {message.img && !imageLoaded && (
                        <Flex mt={5} w={"200px"}>
                            <Image src={message.img} hidden onLoad={() => setImageLoaded(true)} alt='Messsage image' borderRadius={4} />
                            <Skeleton w={"200px"} h={"200px"} borderRadius={4} />
                        </Flex>
                    )}

                    {message.img && imageLoaded && (
                        <Flex mt={5} w={"200px"}>
                            <Image src={message.img} alt='Messsage image' borderRadius={4} />
                            <Box
                                alignSelf={"flex-end"}
                                ml={1}
                                color={message.seen ? "blue.400" : ""}
                                fontWeight={"bold"}
                            >
                                <BsCheck2All size={16} />
                            </Box>
                        </Flex>
                    )}

                    <Avatar
                        src={user?.profilePic}
                        w={"7"}
                        h={"7"}
                    />
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar
                        src={selectedConversation.userProfilePic}
                        w={"7"}
                        h={"7"}
                    />
                    {message.text && (
                        <Text
                            maxW={"350px"}
                            bg={"gray.400"}
                            p={1}
                            px={2}
                            borderRadius={"md"}
                            color={"black"}
                        >
                            {message.text}
                        </Text>
                    )}
                    {message.img && !imageLoaded && (
                        <Flex mt={5} w={"200px"}>
                            <Image src={message.img} hidden onLoad={() => setImageLoaded(true)} alt='Messsage image' borderRadius={4} />
                            <Skeleton w={"200px"} h={"200px"} borderRadius={4} />
                        </Flex>
                    )}

                    {message.img && imageLoaded && (
                        <Flex mt={5} w={"200px"}>
                            <Image src={message.img} alt='Messsage image' borderRadius={4} />
                        </Flex>
                    )}
                </Flex>
            )}
        </>
    )
}

export default Message
