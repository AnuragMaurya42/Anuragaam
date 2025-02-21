import { setMessages } from "../redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    console.log("real time call ho raha hai ");
    
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { messages } = useSelector(store => store.chat);
    console.log(socket.id);
    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
        })

        return () => {
            socket?.off('newMessage');
        }
    }, [messages, setMessages]);
};
export default useGetRTM;