import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout.jsx";
import Home from "./components/Home.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import EditProfile from "./components/EditProfile.jsx";
import Chatpage from "./components/Chatpage.jsx";
import ChatWithUser from "./components/ChatWithUser.jsx";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice.js";
import { setOnlineUsers } from "./redux/chatSlice.js";
import { setLikeNotification } from "./redux/rtnSlice.js";

// Browser Router Configuration
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <Chatpage />,
      },
      {
        path: "/chat/:id",
        element: <ChatWithUser />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const {socket} = useSelector(store=>store.socketio);

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));


      // Listen for online users
       socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // Listen for notifications
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    }
    else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
