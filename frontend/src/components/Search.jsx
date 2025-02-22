import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]); // Store the original list of users
  const [filteredUsers, setFilteredUsers] = useState([]); // Store the filtered list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://anuragaam-app.onrender.com/api/v1/user/users');
        if (res.data.success) {
          setUsers(res.data.users);
          setFilteredUsers(res.data.users); // Initialize both lists
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users); // Reset to original list if search is cleared
    } else {
      setFilteredUsers(
        users.filter(user =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search Users..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600"
        >
          Search
        </button>
      </div>
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
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
