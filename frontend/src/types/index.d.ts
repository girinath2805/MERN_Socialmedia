interface IReply {
    _id:string;
    userId: string;
    text: string;
    userName: string;
    userProfilePic?: string;
}

interface IPost {
    _id: string,
    createdAt: string,
    likes: string[],
    postedBy: string,
    replies: IReply[],
    text: string,
    img?: string,
}

interface IParticipant {
    _id: string,
    userName: string,
    profilePic: string,
};

interface IConversation {
    _id: string,
    participants: IParticipant[],
    lastMessage: {
        text: string,
        sender: string,
        seen: boolean,
    },
    mock?: boolean
};

interface IMessage {
    _id: string,
    conversationId: string,
    sender: string,
    text: string,
    img: string,
    seen: boolean,
    createdAt: string,
    updatedAt: string
}

interface IUser {
    _id: string;
    userName: string;
    name: string;
    email: string;
    bio: string;
    profilePic: string,
    following?: string[],
    followers?: string[]
}

export { IUser, IPost, IMessage, IConversation, IParticipant, IReply}