import React, { useState } from 'react';
import {
  Home,
  Search,
  PlusSquare,
  MessageCircle,
  Heart,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { setAuthUser } from '../redux/authSlice.js';


const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  // State for the Create Post dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for the loader

  // Logout handler
  const LogoutHandler = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v1/user/logout',
        { withCredentials: true }
      );
      if (res.data.message) {
        dispatch(setAuthUser(null));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed.');
      console.log(error);
    }
  };

  // Function to handle image selection
  const handleImageChange = (e) => {
    setPostImage(e.target.files[0]);
  };

  // Function to handle post submission
  const handlePostSubmit = async () => {


    if (!postImage) {
      toast.error('Please provide an image.');
      return;
    }

    

    const formData = new FormData();
    formData.append('image', postImage);
    formData.append('caption', caption);

    try {
      
      setIsLoading(true); // Start the loader
   

      const res = await axios.post(
        'http://localhost:8000/api/v1/post/addpost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      // alert( caption);
      if (res.data.success) {
        toast.success(res.data.message);
        setIsDialogOpen(false);
        setPostImage(null);
        setCaption('');
      } else {
        toast.error(res.data.message || 'Failed to create post.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post.......');
      console.log(error);
    } finally {
      setIsLoading(false); // Stop the loader
    }
  };

  const menuItems = [
    { name: 'Home', icon: <Home />, onClick: () => navigate('/') },
    { name: 'Search', icon: <Search />, onClick: () => navigate('/search') },
    {
      name: 'Create',
      icon: <PlusSquare />,
      onClick: () => setIsDialogOpen(true),
    },
    {
      name: 'Notifications',
      icon: <Heart />,
      onClick: () => navigate('/notifications'),
    },
    {
      name: 'Messages',
      icon: <MessageCircle />,
      onClick: () => navigate('/messages'),
    },
    {
      name: 'Profile',
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt={user?.username} />
          <AvatarFallback>
            {user?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      onClick: () => navigate(`/profile/${user?.username}`),
    },
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
          <p
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center py-2 md:flex-row md:items-center md:py-3 hover:bg-gray-100 w-full cursor-pointer"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs mt-1 md:ml-4 md:mt-0 md:text-base hidden md:block">
              {item.name}
            </span>
          </p>
        ))}
      </nav>

      {/* Create Post Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
              </div>
            )}
            <h2 className="text-xl font-bold mb-4 text-center">
              Create New Post
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {postImage && (
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(postImage)}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Caption
              </label>
              <textarea
                rows="3"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Write a caption..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePostSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button (Hidden on Mobile) */}
      <div className="hidden md:flex md:mt-auto md:mb-4">
        <button
          onClick={LogoutHandler}
          className="flex flex-col items-center py-2 md:flex-row md:items-center md:py-3 w-full bg-transparent hover:bg-gray-100"
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
