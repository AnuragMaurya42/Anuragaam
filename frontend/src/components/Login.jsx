import axios from 'axios'; 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('User logging in with:', formData);

    try {
      setLoading(true);

      const res = await axios.post('http://localhost:8000/api/v1/user/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (res.data.success) {
        navigate('/')
        toast.success('Login successful');
        setFormData({
          email: "",
          password: ""
        });
      }
    } catch (error) {
      console.log(error);
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-white transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-center mb-6">
          <img src="logo.png" alt="Logo" className="w-12 h-12 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg transform hover:translate-y-1 hover:shadow-xl transition-all">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <p className="text-center">don't have an account? <Link to="/signup" className="text-blue-600">Signup</Link></p>

        </form>
      </div>
    </div>
  );
};

export default Login;
