import useGetRTM from '../hooks/useGetRTM';
import useGetallMessage from '../hooks/useGetallMessage';
import React from 'react';
import { useSelector } from 'react-redux';

const Messages = ({ chatUserId }) => {
  useGetRTM();
  useGetallMessage(chatUserId);

  const { messages = [] } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div
      className='overflow-y-auto flex-1 p-4'
      style={{ 
        position: "sticky", 
        bottom: "45px",
        top: "10px", 
        padding: "10px",
        boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)"
      }}
    >
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div 
            className={`flex ${msg.senderId === user._id ? 'justify-start' : 'justify-end'}`} 
            key={index}
          >
            <div 
              className={`max-w-xs p-2  ${
                msg.senderId === user._id 
                  ? 'text-right text-green-600 font-bold'   // Sent message style (left)
                  : 'text-left text-red-600 font-bold' // Received message style (right)
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))
      ) : (
        <p>No messages yet</p>
      )}
    </div>
  );
};

export default Messages;
