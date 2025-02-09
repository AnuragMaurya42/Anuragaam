import React from 'react';
import {
  Home,
  Search,
  PlusSquare,
  MessageCircle,
  Heart,
  User,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const navigate = useNavigate();

  const LogoutHandler = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v1/user/logout',
        { withCredentials: true }
      );
      if (res.data.message) {
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const menuItems = [
    { name: 'Home', icon: <Home /> },
    { name: 'Search', icon: <Search /> },
    { name: 'Create', icon: <PlusSquare /> },
    { name: 'Notifications', icon: <Heart /> },
    { name: 'Messages', icon: <MessageCircle /> },
    { name: 'Profile', icon: <User /> },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t md:static md:w-64 md:h-screen md:border-t-0 md:border-r">
      {/* Logo (Hidden on Mobile) */}
      <div className="hidden md:flex items-center justify-center py-6">
        <a href="/" className="text-2xl font-bold">
          Anuragaam
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex justify-between px-4 md:flex-col md:justify-start md:mt-4 ">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="/#"
            className="flex flex-col items-center py-2 md:flex-row md:items-center md:py-3 hover:bg-red-100 "
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs mt-1 md:ml-4 md:mt-0 md:text-base hidden md:block hover:bg-red-100">
              {item.name}
            </span>
          </a>
        ))}
      </nav>

      {/* Logout Button (Hidden on Mobile) */}
      <div className="hidden md:flex md:mt-auto md:mb-4">
        <button
          onClick={LogoutHandler}
               className="flex flex-col items-center py-2 md:flex-row md:items-center md:py-3 w-full bg-transparent hover:bg-red-100 "
        >
          <span className="text-2xl">
            <LogOut />
          </span>
          <span className="ml-4 text-base">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
