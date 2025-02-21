import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RightSidebar = ({ isOpen, setIsOpen }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/user/users');
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Logout Function
  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    localStorage.removeItem('authToken');
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen bg-gradient-to-br from-purple-900 to-gray-800 shadow-2xl p-4 flex flex-col transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-x-0 w-64' : 'translate-x-full w-0'
        } text-white overflow-hidden z-50`}
      >
        {/* Sidebar Content */}
        <div className="flex-grow mt-6 overflow-y-auto">
          {isOpen ? (
            users.length > 0 ? (
              <ul className="space-y-4">
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center gap-4 p-2 rounded-lg transition transform hover:scale-105 hover:bg-purple-800 shadow-md cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    <Avatar className="w-12 h-12 rounded-full border-2 border-purple-500 shadow-lg overflow-hidden">
                      <AvatarImage
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <AvatarFallback className="bg-purple-700 text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-lg">{user.username}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400">No users found.</p>
            )
          ) : (
            <p className="text-xs text-center">RS</p>
          )}
        </div>

        {/* Logout Button - Stick to Bottom */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-md mt-auto"
          style={{ marginTop: 'auto' }} // Ensure it sticks to the bottom
        >
          Logout
        </button>
      </div>

      {/* Toggle Button - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition shadow-lg z-50 ${
          isOpen ? 'text-purple-300' : 'text-white'
        }`}
      >
        <Menu size={24} />
      </button>
    </>
  );
};

export default RightSidebar;
