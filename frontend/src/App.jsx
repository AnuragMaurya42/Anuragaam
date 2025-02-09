import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import Home from './components/Home.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,  // MainLayout wraps only Home and Signup
    children: [
      {
        path:'/',
        element: <Home/>,
      },
      {
      path:'/profile',
      element:<Profile/>
      },
    ],
  },
  {
    path: '/login',  // Login is a separate route, no MainLayout
    element: <Login />,
  },
  {
    path: 'signup',
    element: <Signup />,
  },
]);

function App() {
  return <RouterProvider router={browserRouter} />;
}

export default App;
