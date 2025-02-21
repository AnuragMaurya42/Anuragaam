import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserprofile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Messages from "./Messages";

const ChatWithUser = () => {
  // Get chatUser ID from the URL
  const params = useParams();
  const chatUserId = params.id; // Extracted directly from the URL
  
  // Fetch user profile using custom hook
  useGetUserProfile(chatUserId);

  // Get user data from Redux store
  const { userProfile } = useSelector((store) => store.auth);

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
          <h2 className="font-bold text-2xl">{userProfile?.username || "User"}</h2>
          <p className="text-gray-600 text-sm">{userProfile?.bio}</p>
        </div>
      </header>

      {/* Chat Messages */}
      <div 
        className="overflow-y-auto p-4"
        style={{ 
          height: "calc(100vh - 200px)", // 200px = header (60px) + footer (80px) + 60px extra space for button
          marginBottom: "60px", // Space for the sticky button
          background: "linear-gradient(to right, rgb(201 230 253), rgb(227 230 86 / 45%))"
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
          boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)"
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow border rounded-l-lg p-2 focus:outline-none"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition">
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatWithUser;
