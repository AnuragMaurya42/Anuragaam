import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  const { posts } = useSelector(store => store.post);

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg">
      {posts.map((post) => (
        <div key={post._id} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default Posts;
