import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const[loading,setloading] = useState(false);
  const navigate = useNavigate();

const { user } = useSelector((store) => store.auth);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('User signed up with:', formData);

  try {
    
    setloading(true)

    const res = await axios.post('http://localhost:8000/api/v1/user/register', formData,{
      headers: {
        'Content-Type': 'application/json'
      },withCredentials: true  
    });
  if(res.data.success){
    toast.success('account created successfully');
    setFormData({
      username: "",
      email: "",
      password: ""

    });

  }



  } catch (error) {
    console.log(error);
    toast.error('Something went wrong');
    
  }
finally{
  setloading(false);
}





  };
  useEffect(()=>{
    if(user){
      navigate('/')
    }
    },[])

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-white transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-center mb-6">
          <img src="logo.png" alt="Logo" className="w-12 h-12 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
        </div>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
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
            Sign Up
          </button>
          <p className="text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>

        </form>
      </div>
    </div>
  );
};

export default Signup;
