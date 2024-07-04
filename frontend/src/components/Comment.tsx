import { Avatar, Divider, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "./Actions"

const Comment = ({comment, createdAt, likes, userName, userAvatar} : {comment:string, createdAt:string, likes:number, userName:string, userAvatar:string}) => {
    const [liked, setLiked] = useState<boolean>(false)
  return (
    <>
    <Flex gap={4} my={2} py={2} w={'full'}>
        <Avatar src={userAvatar} size={'sm'}/>
        <Flex gap={1} w={'full'} flexDirection={'column'}>
            <Flex w={'full' } justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize={'sm'} fontWeight={'bold'}>{userName}</Text>
                <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={'sm'} color={'gray.light'}>{createdAt}</Text>
                    <BsThreeDots/>
                </Flex>
            </Flex>
            <Text>{comment}</Text>
            <Actions liked={liked} setLiked={setLiked}/>
            <Text fontSize={'sm'} color={'gray.light'}>
                {likes + (liked ? 1 : 0)} likes
            </Text>
        </Flex>
    </Flex>
    <Divider/>
    </>
  )
}

export default Comment
