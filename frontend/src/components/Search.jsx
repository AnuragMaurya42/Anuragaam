import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

const UserListWithSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://anuragaam-app.onrender.com/api/v1/user/users');
        if (res.data.success) {
          setFilteredUsers(res.data.users);
        }
      } catch (err) {
        setError('Error fetching users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(prevUsers =>
      prevUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>
      <input
        type="text"
        placeholder="Search Users..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 rounded w-full mb-4"
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <ul className="space-y-4">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center gap-4 p-2 rounded-lg transition transform hover:scale-105 hover:bg-gray-100 shadow-md cursor-pointer"
              onClick={() => handleUserClick(user._id)}
            >
              <Avatar className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-lg overflow-hidden">
                <AvatarImage
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="bg-gray-300 text-gray-800 font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg">{user.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserListWithSearch;
