import { Image, Text, Icon, FlexProps, BoxProps, Box, CloseButton, Flex, useColorModeValue, Avatar, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, VStack, Drawer, DrawerContent, useDisclosure, useColorMode } from "@chakra-ui/react"
import { ReactNode } from "react"
import { IconType } from "react-icons"
import {
    FiHome,
    FiSettings,
    FiMenu,
    FiChevronDown,
    FiLogOut,
} from 'react-icons/fi'
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { CgProfile } from "react-icons/cg"
import { Link } from "react-router-dom"
import useLogout from "../hooks/useLogout"
import { BsChatDotsFill } from "react-icons/bs"

interface LinkItemProps {
    name: string
    icon: IconType
    path: string
}

interface NavItemProps extends FlexProps {
    icon: IconType
    children: React.ReactNode
}

interface MobileProps extends FlexProps {
    onOpen: () => void
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

interface SidebarWithHeaderProps {
    children: ReactNode;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome, path: "/" },
    { name: "Chat", icon: BsChatDotsFill, path: "/chat" },
    { name: 'Settings', icon: FiSettings, path: "/settings" },
]

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const { toggleColorMode } = useColorMode()
    return (
        <Box
            bg={useColorModeValue("white", "black")}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="6" justifyContent="space-between">
                <Flex justifyContent={"center"} mt={6} mb={4} gap={4}>
                    <Image
                        cursor={"pointer"}
                        alt="logo"
                        h={10}
                        w={10}
                        src={"/logo.svg"}
                        onClick={toggleColorMode}
                        transition="3s ease"
                    />
                    <Text fontSize={"xl"} fontWeight={"bold"}>Yoink</Text>
                </Flex>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <Link key={link.name} to={link.path} onClick={onClose}>
                    <NavItem icon={link.icon}>
                        {link.name}
                    </NavItem>
                </Link>
            ))}
        </Box>
    )
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Box
            as="a"
            href="#"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: '#0173ff',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    )
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const user = useRecoilValue(userAtom);
    const handleLogout = useLogout()
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'black')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />


            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={user?.profilePic}
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{user?.name}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {user?.userName}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'white')}>
                            <MenuItem
                                bg={useColorModeValue("white", "gray.900")}
                                _hover={{
                                    bg: useColorModeValue("gray.900", "white"),
                                    color: useColorModeValue("white", "black")
                                }}
                                as={Link}
                                to={`/${user?.userName}`}
                                gap={2}
                            >
                                <CgProfile />
                                <Box flex="1">Profile</Box>
                            </MenuItem>
                            <MenuItem
                                bg={useColorModeValue("white", "gray.900")}
                                _hover={{
                                    bg: useColorModeValue("gray.900", "white"),
                                    color: useColorModeValue("white", "black")
                                }}
                                as={Link}
                                to={"/settings"}
                                gap={2}
                            >
                                <FiSettings />
                                <Box flex="1">Settings</Box>
                            </MenuItem>
                            <MenuItem
                                bg={useColorModeValue("white", "gray.900")}
                                _hover={{
                                    bg: useColorModeValue("gray.900", "white"),
                                    color: useColorModeValue("white", "black")
                                }}
                                onClick={handleLogout}
                                gap={2}
                            >
                                <FiLogOut />
                                <Box flex="1">Logout</Box>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    )
}

const SidebarWithHeader = ({ children }: SidebarWithHeaderProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box minH="100vh" bg={useColorModeValue('white', 'black')}>
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    )
}

export default SidebarWithHeader