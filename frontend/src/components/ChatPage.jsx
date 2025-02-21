import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chatpage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth); // Current user
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { onlineUsers } = useSelector((store) => store.chat);

  // Fetch all users excluding current user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/users");
        if (res.data.success) {
          // Exclude current user
          const filteredUsers = res.data.users.filter((u) => u._id !== user._id);
          setUsers(filteredUsers);
        } else {
          console.log("No users found:", res.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [user._id]);

  return (
    <div className="flex justify-center h-screen p-4 bg-gray-100">
      <section className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
        <h1 className="font-bold mb-4 text-xl text-center">{user?.username}</h1>
        <h4 className="text-center text-gray-600">{user?.bio}</h4>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[70vh]">
          {users?.length > 0 ? (
            users.map((u) => {
              const isOnline = onlineUsers.includes(u?._id);
              return (
                <div
                  key={u?._id}
                  className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => navigate(`/chat/${u._id}`)}
                >
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={u?.profilePicture} alt={u?.username} />
                    <AvatarFallback>
                      {u?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{u?.username}</span>
                    <span
                      className={`text-sm ${
                        isOnline ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No users found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Chatpage;
