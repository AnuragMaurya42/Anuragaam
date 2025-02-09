import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart } from "react-icons/fa";
import CommentDialog from "./ui/CommentDialog";

const Post = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-8 w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <h1 className="font-semibold text-gray-800 dark:text-gray-100">username</h1>
        </div>

        {/* Popup Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition duration-200" />
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 bg-black/40" />
            <DialogContent
              className="fixed top-1/2 left-1/2 w-64 p-4 bg-white dark:bg-gray-700 rounded-md shadow-md
                         transform -translate-x-1/2 -translate-y-1/2
                         focus:outline-none space-y-2"
            >
              <Button variant="ghost" className="w-full justify-start text-gray-800 dark:text-gray-100">
                Unfollow
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-800 dark:text-gray-100">
                Add to cart
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
              >
                Delete
              </Button>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>

      {/* Post Image */}
      <div>
        <img
          className="w-full h-auto object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[600px]"
          src="https://plus.unsplash.com/premium_photo-1666278379770-440439b08656?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YW5pbWFsc3xlbnwwfHwwfHx8MA%3D%3D"
          alt="image_post"
        />
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-4 text-2xl px-4 py-2 text-gray-600 dark:text-gray-300">
        <FaHeart className="cursor-pointer hover:text-red-500 transition duration-200" />
        <MessageCircle
          onClick={() => setOpen(true)}
          className="cursor-pointer hover:text-blue-500 transition duration-200"
        />
        <Send className="cursor-pointer hover:text-green-500 transition duration-200" />
      </div>

      {/* Post Likes */}
      <div className="px-4">
        <span className="font-semibold text-gray-800 dark:text-gray-100">1k likes</span>
      </div>

      {/* Post Caption */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-800 dark:text-gray-100">
          <span className="font-medium mr-2">Username</span>
          Caption
        </p>
        <span
          onClick={() => setOpen(true)}
          className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:underline"
        >
          View all 10 comments
        </span>
      </div>

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Comment Input */}
      <div className="flex items-center border-t border-gray-200 dark:border-gray-700 p-4">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-grow outline-none text-sm bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 mr-2 text-gray-800 dark:text-gray-100"
        />
        <span className="text-blue-500 font-semibold cursor-pointer hover:text-blue-600">
          Post
        </span>
      </div>
    </div>
  );
};

export default Post;
