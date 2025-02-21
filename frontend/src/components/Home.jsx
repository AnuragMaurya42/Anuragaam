import React from 'react';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import useGetAllPost from '../hooks/useGetAllPost.jsx';
import { Outlet } from 'react-router-dom';

const Home = () => {
  useGetAllPost();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet/>
      </div>
  
    </div>
  );
}

export default Home;
