// useGetUserProfile.jsx
import { setUserProfile } from "../redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
   
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        } 
        else {
          console.error("Failed to fetch user profile:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, dispatch]);
};

export default useGetUserProfile;
