import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserprofile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import UserPostsGrid from "./UserPostsGrid";
import axios from "axios";
import { setUserProfile, setAuthUser } from "../redux/authSlice";
import { toast } from "sonner";

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { userProfile, user } = useSelector((store) => store.auth);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  const isCurrentUser = user?._id === userProfile._id;
  const isFollowing = userProfile.followers?.includes(user._id);

  const handleFollowUnfollow = async () => {
    try {
      console.log(userProfile._id);
      
      const response = await axios.post(
        `https://anuragaam-app.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const updatedFollowers = isFollowing
          ? userProfile.followers.filter((id) => id !== user._id)
          : [...userProfile.followers, user._id];

        const updatedProfile = {
          ...userProfile,
          followers: updatedFollowers,
        };

        dispatch(setUserProfile(updatedProfile));

        // Update the logged-in user's following list
        const updatedFollowing = isFollowing
          ? user.following.filter((id) => id !== userProfile._id)
          : [...user.following, userProfile._id];

        const updatedUser = {
          ...user,
          following: updatedFollowing,
        };

        dispatch(setAuthUser(updatedUser));

        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to follow/unfollow user."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar Section */}
        <div className="flex justify-center md:justify-end md:pr-8">
          <Avatar className="h-40 w-40 rounded-full border-4 border-gray-300 overflow-hidden shadow-md">
            <AvatarImage
              src={userProfile?.profilePicture}
              alt="profilephoto"
              className="object-cover h-full w-full"
            />
            <AvatarFallback className="text-xl font-semibold flex items-center justify-center h-full w-full bg-gray-200">
              {userProfile?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Info Section */}
        <div className="md:w-2/3 flex flex-col">
          {/* Username and Buttons */}
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-light">{userProfile?.username}</h2>
            {isCurrentUser ? (
              <Link to="/account/edit">
                <Button className="px-4 py-1 border rounded text-sm font-semibold bg-blue-600 hover:bg-blue-400">
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleFollowUnfollow}
                className="px-4 py-1 bg-blue-500 text-white rounded text-sm font-semibold hover:bg-blue-600"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-4">
            <div>
              <span className="font-semibold">
                {userProfile?.posts?.length || 0}
              </span>{" "}
              posts
            </div>
            <div>
              <span className="font-semibold">
                {userProfile?.followers?.length || 0}
              </span>{" "}
              followers
            </div>
            <div>
              <span className="font-semibold">
                {userProfile?.following?.length || 0}
              </span>{" "}
              following
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            <p className="font-semibold">{userProfile?.fullName}</p>
            <p>{userProfile?.bio || "Bio here..."}</p>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <UserPostsGrid userId={userProfile._id} />
    </div>
  );
};

export default Profile;
