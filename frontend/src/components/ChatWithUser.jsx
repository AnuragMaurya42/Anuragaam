import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserprofile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "../redux/chatSlice";

const ChatWithUser = () => {
  const [textMessage, setTextMessage] = useState("");
  const { messages } = useSelector((store) => store.chat);

  const dispatch = useDispatch();
  const params = useParams();
  const chatUserId = params.id;

  // Fetch user profile using custom hook
  useGetUserProfile(chatUserId);

  // Get user data and online status from Redux store
  const { userProfile } = useSelector((store) => store.auth);
  const { onlineUsers } = useSelector((store) => store.chat);

  // Check if the user is online
  const isOnline = onlineUsers.includes(chatUserId);

  // Fetch messages when the component loads
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/get/${chatUserId}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [chatUserId, dispatch]);

  // Send message function
  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${chatUserId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        // Update the messages array by adding the new message
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-blue-100 to-blue-300">
      {/* Header Section */}
      <header className="p-4 border-b border-gray-300 flex items-center gap-4">
        <Avatar className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-md">
          <AvatarImage
            src={userProfile?.profilePicture}
            alt={userProfile?.username}
            className="w-full h-full object-cover rounded-full"
          />
          <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full">
            {userProfile?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-2xl">
            {userProfile?.username || "User"}
          </h2>
          <p
            className={`text-sm ${
              isOnline ? "text-green-500" : "text-red-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </header>

      {/* Chat Messages */}
      <div
        className="overflow-y-auto p-4"
        style={{
          height: "calc(100vh - 200px)",
          marginBottom: "60px",
          background:
            "linear-gradient(to right, rgb(201 230 253), rgb(227 230 86 / 45%))",
        }}
      >
        <Messages chatUserId={chatUserId} />
      </div>

      {/* Input Box & Send Button */}
      <footer
        className="w-full flex items-center gap-2"
        style={{
          position: "sticky",
          bottom: "60px",
          padding: "10px",
          background: "rgb(145 189 233)",
          boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <input
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-grow border rounded-l-lg p-2 focus:outline-none"
        />
        <button
          onClick={sendMessageHandler}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatWithUser;
