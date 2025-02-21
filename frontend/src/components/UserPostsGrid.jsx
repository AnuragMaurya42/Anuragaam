import React from "react";
import { useSelector } from "react-redux";

const UserPostsGrid = ({ userId }) => {
  const { posts } = useSelector((store) => store.post);

  // Filter posts to show only those by the user
  const userPosts = posts.filter((post) => post.author._id === userId);

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {userPosts.map((post) => (
          <div
            key={post._id}
            className="group relative bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={post.image}
              alt={`Post by ${post.author.username}`}
              className="w-full h-48 md:h-64 object-cover group-hover:opacity-80 transition-opacity duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center text-white">
              <span className="font-semibold">
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </span>
              <span className="font-semibold">@{post.author.username}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPostsGrid;
