import React from 'react';
import Feed from './Feed';
import RightSidebar from './RightSidebar';

const Home = () => {
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
      </div>
  
    </div>
  );
}

export default Home;
