import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { BsCheck2All, BsImageFill } from 'react-icons/bs';
import { selectedConversationAtom } from '../atoms/messagesAtom';
import { IConversation } from '../types';


interface ConversationProps {
    conversation: IConversation
    isOnline: boolean
};

const Conversation = ({ conversation, isOnline }: ConversationProps) => {

    const { colorMode } = useColorMode()
    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;
    const currentUser = useRecoilValue(userAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)

    return (
        <Flex
            gap={4}
            alignItems={"center"}
            p={1}
            _hover={{
                cursor: "pointer",
                bg: useColorModeValue("gray.600", "gray.dark"),
                color: "white"
            }}
            borderRadius={"md"}
            onClick={() => setSelectedConversation({
                _id: conversation._id,
                userId: user._id,
                userName: user.userName,
                userProfilePic: user.profilePic,
                mock: conversation.mock ?? false,
            })}
            bg={selectedConversation._id === conversation._id ? (colorMode === 'light' ? "gray.400" : "gray.dark") : undefined}
        >
            <WrapItem>
                <Avatar
                    size={{
                        base: "xs",
                        sm: "sm",
                        md: "md"
                    }}
                    src={user.profilePic}
                >
                    {isOnline && (
                        <AvatarBadge
                            boxSize={"1em"}
                            bg="green.500"
                        />
                    )}
                </Avatar>
            </WrapItem>
            <Stack
                direction={"column"}
                fontSize={"sm"}
            >
                <Text
                    fontWeight={700}
                    display={"flex"}
                    alignItems={"center"}
                >
                    {user.userName}
                    <Image
                        src='/verified.png'
                        w={4}
                        h={4}
                        ml={1} />
                </Text>
                <Text
                    fontSize={"xs"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                >
                    {currentUser?._id === lastMessage.sender ? (
                        <Box color={lastMessage.seen ? "blue.400" : ""}>
                            <BsCheck2All size={16} />
                        </Box>
                    ) : null}
                    {lastMessage.sender.length > 0 ? (
                        lastMessage.text.length > 0 ? (
                            lastMessage.text.length > 18 ? (
                                lastMessage.text.substring(0, 18) + "..."
                            ) : (
                                lastMessage.text
                            )
                        ) : (
                            <>
                                <BsImageFill size={10} />
                                Image
                            </>
                        )
                    ) : null}
                </Text>
            </Stack>
        </Flex>
    )
}

export default Conversation
