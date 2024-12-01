import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io, Socket } from "socket.io-client";
import userAtom from "../atoms/userAtom";

// Create the context with a specific type
const SocketContext = createContext<{ socket: Socket | null, onlineUsers: any[] } | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

// Define the provider component
export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        if (user?._id) {
            const socketUrl = "http://localhost:5000";
            const socket = io(socketUrl, {
                query: {
                    userId: user._id,
                },
            });

            socket.on("connect", () => {
                console.log("User connected")
            })
            
            socket.on("disconnect", () => {
                console.error("User disconnected");
            });

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            setSocket(socket);

            return () => {
                socket.close();
            };
        }
    }, [user?._id]); 

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
