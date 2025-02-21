// src/hooks/useGetAllMessage.js
import { setMessages } from "../redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllMessage = (chatUserId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                if (!chatUserId) return;  // Guard clause for no chatUserId
                
                const res = await axios.get(`https://anuragaam-app.onrender.com/api/v1/message/all/${chatUserId}`, { 
                    withCredentials: true 
                });

                if (res.data.success) {  
                    dispatch(setMessages(res.data.messages));
                } else {
                    console.log("Failed to fetch messages:", res.data);
                }
            } catch (error) {
                console.log("Error fetching messages:", error);
            }
        };

        fetchAllMessage();
    }, [chatUserId, dispatch]);
};

export default useGetAllMessage;
