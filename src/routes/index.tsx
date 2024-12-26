import { Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import Profile from '@/pages/Profile';
import BrowseCars from '@/pages/BrowseCars';
import CarDetails from '@/pages/CarDetails';
import ListCar from '@/pages/ListCar';

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/cars',
    element: <BrowseCars />,
  },
  {
    path: '/cars/:id',
    element: <CarDetails />,
  },
  {
    path: '/list-car',
    element: <ListCar />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
