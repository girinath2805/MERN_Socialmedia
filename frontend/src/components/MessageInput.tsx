import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { IoSendSharp } from "react-icons/io5"
import useShowToast from "../hooks/UseShowToast";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { BsImageFill } from "react-icons/bs";
import UsePreviewImg from "../hooks/UsePreviewImg";

interface MessageInputProps {
  setMessages: (messages: any) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ setMessages }: MessageInputProps) => {

  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const [conversations, setConversations] = useRecoilState(conversationsAtom)
  const [messageText, setMessageText] = useState("");
  const { showToast } = useShowToast();
  const imageRef = useRef<HTMLInputElement>(null);
  const { onClose } = useDisclosure()
  const { handleImgChange, imgUrl, file, setImgUrl, setFile } = UsePreviewImg()
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if (isSending) return;

    setIsSending(true)

    try {
      const response = await axios.post('/api/messages', {
        recipientId: selectedConversation.userId,
        message: messageText,
        img: file,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      if (response.data.error) {
        showToast({
          title: 'Error',
          description: response.data.error,
          status: 'error',
        });
      } else {
        setMessages((messages: any) => [...messages, response.data])
        setConversations((prevConv: any) => {
          const updatedConversations = prevConv.map((conversation: any) => {
            if (conversation._id === selectedConversation._id) {
              return {
                ...conversation,
                lastMessage: {
                  text: messageText,
                  sender: response.data.sender
                }
              }
            }
            return conversation
          })
          return updatedConversations
        })
      }
      setImgUrl("")
      setMessageText("")
      setFile(null)
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
      setIsSending(false)
    }
  }

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder="Type a message"
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement
            cursor={"pointer"}
            rounded={"lg"}
            _hover={{
              bg: "gray.500"
            }}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            onClick={handleSendMessage}
          >
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <BsImageFill
          size={20}
          onClick={() => imageRef.current?.click()}
        />
        <Input
          type="file"
          hidden
          ref={imageRef}
          onChange={handleImgChange}
        />
      </Flex>
      <Modal
        isOpen={!!imgUrl}
        onClose={() => {
          onClose();
          setImgUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imgUrl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default MessageInput
