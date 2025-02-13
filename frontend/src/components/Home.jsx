import React from 'react';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import useGetAllPost from '../hooks/useGetAllPost.jsx';

const Home = () => {
  useGetAllPost();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
      </div>
  
    </div>
  );
}

export default Home;
