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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice.js";
import { setOnlineUsers } from "./redux/chatSlice.js";

// Fixing Browser Router
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
    path: "/signup",  // Fixed missing slash here
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let socketio; // Declaring socketio here for proper scoping
    if (user) {
      socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));
      // Listen for online users
      socketio.on("getOnlineUsers", (onLineUsers) => {
        dispatch(setOnlineUsers(onLineUsers));
      });
    } else if (socketio) {
      socketio.close();
      dispatch(setSocket(null));
    }

    return () => {
      if (socketio) {
        socketio.close();
        dispatch(setSocket(null));
      }
    };
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
