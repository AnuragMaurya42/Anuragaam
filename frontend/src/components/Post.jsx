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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "../redux/postSlice"; // Adjust the import path as needed

const Post = ({ post }) => {
  const [open, setOpen] = useState(false);
  const user = useSelector((store) => store.auth.user);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);

  const [comments, setComments] = useState(post.comments);
  const [text, setText] = useState("");
  const [isFollowing, setIsFollowing] = useState(
    user?.following?.includes(post.author._id) || false
  );

  const followHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${post.author._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsFollowing(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Something went wrong while following the user.");
    }
  };

  const unfollowHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${post.author._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsFollowing(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Something went wrong while unfollowing the user.");
    }
  };

  if (!post) {
    return <div>Post not found</div>;
  }

  const DeletePostHandler = async () => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDeletion) return;

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        // Update the posts in Redux store
        dispatch(setPosts(posts.filter((p) => p._id !== post._id)));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting the post.");
    }
  };

  const likedOrDislikedHandler = async () => {

    try {
      const action = liked ? "dislike" : "like";
      console.log("post id" , post);
      console.log("action =" , action);
      
      
  
      // Send request to like or dislike the post
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
  
      if (res.data.success) {
        // Toggle the liked state and update the like count
        setLiked(!liked);
        setPostLike((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
  
        // Update Redux Store
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
  
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error while liking/disliking post:", error);
      toast.error("Something went wrong while updating the like status.");
    }
  };
  

  const commentHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/comment/${post._id}`,
        { comment: text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Something went wrong while adding the comment.");
    }
  };

  return (
    <div className="relative my-8 w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-[1.02] hover:shadow-2xl">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        {/* User Info */}

        <div className="flex items-center gap-2">
          <Avatar
            className="w-12 h-12"
            style={{
              borderRadius: "50%",
              border: "2px solid #e1306c", // Instagram-like border color
              overflow: "hidden",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            <AvatarImage
              src={post.author.profilePicture || ""}
              alt="post_image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
            <AvatarFallback
              style={{
                backgroundColor: "#f0f0f0",
                color: "#555",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                fontWeight: "bold",
                fontSize: "1.1rem",
                borderRadius: "50%",
              }}
            >
              {post.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="font-semibold text-gray-800 dark:text-gray-100">
            {post.author.username}
          </h1>
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
              {user && user._id !== post.author._id && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-800 bg-blue-300 dark:text-gray-100"
                  onClick={isFollowing ? unfollowHandler : followHandler}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full justify-start text-gray-800 bg-blue-300 dark:text-gray-100"
              >
                Add to favorites
              </Button>

              {user && user._id === post.author._id && (
                <Button
                  variant="ghost"
                  className="w-full justify-start bg-blue-300 "
                  onClick={DeletePostHandler}
                >
                  Delete
                </Button>
              )}
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>

      {/* Post Image */}
      <div>
        <img
          className="w-full h-auto object-contain rounded-none"
          src={post.image}
          alt="image_post"
        />
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-4 text-2xl px-4 py-2 text-gray-600 dark:text-gray-300">
        <FaHeart
          onClick={likedOrDislikedHandler}
          className={`cursor-pointer transition duration-200 ${
            liked ? "text-red-500" : "text-gray-500"
          }`}
        />

        <MessageCircle
          onClick={() => setOpen(true)}
          className="cursor-pointer hover:text-blue-500 transition duration-200"
        />
        <Send className="cursor-pointer hover:text-green-500 transition duration-200" />
      </div>

      {/* Post Likes */}
      <div className="px-4">
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          {postLike} likes
        </span>
      </div>

      {/* Post Caption */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-800 dark:text-gray-100">
          <span className="font-medium mr-2">{post.author.username}</span>
          {post.caption}
        </p>
        <span
          onClick={() => setOpen(true)}
          className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:underline"
        >
          View all {post.comments.length} comments
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commentHandler(e.target.value);
              e.target.value = "";
            }
          }}
        />
        <span
          onClick={(e) => {
            const input = e.target.previousSibling;
            commentHandler(input.value);
            input.value = "";
          }}
          className="text-blue-500 font-semibold cursor-pointer hover:text-blue-600"
        >
          Post
        </span>
      </div>
    </div>
  );
};

export default Post;
