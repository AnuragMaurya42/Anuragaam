import { setPosts } from "../redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/post/all', { withCredentials: true });
        if (res.data.success) {
          console.log(res.data);
          dispatch(setPosts(res.data.posts)); // Dispatch the setPosts action with the fetched posts
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPost();
  }, [dispatch]); // Include dispatch in the dependency array
};

export default useGetAllPost;
