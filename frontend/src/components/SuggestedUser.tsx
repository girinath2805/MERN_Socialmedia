import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { IUser } from "../types";
import useFollowUnfollow from "../hooks/useFollowUnfollow";


const SuggestedUser = ({ user }: { user: IUser }) => {

    const { handleFollowUnfollow, isLoading, following } = useFollowUnfollow(user)

    return (
        <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
            <Flex gap={2} as={Link} to={`${user.userName}`}>
                <Avatar src={user.profilePic} />
                <Box>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                        {user.name}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.light"}>
                        {user.userName}
                    </Text>
                </Box>
            </Flex>
            <Button
                size={"sm"}
                color={following ? "white" : "black"}
                bg={following ? "gray.600" : "white"}
                isLoading={isLoading}
                _hover={{
                    color: following ? "black" : "white",
                    opacity: 0.8,
                    bg: following ? "red.600" : "#0173ff"
                }}
                onClick={handleFollowUnfollow}
            >
                {following ? "Unfollow" : "Follow"}
            </Button>
        </Flex>
    )
}

export default SuggestedUser
