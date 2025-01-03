import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import Profile from '@/pages/Profile';
import BrowseCars from '@/pages/BrowseCars';
import CarDetails from '@/pages/CarDetails';
import ListCar from '@/pages/ListCar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { adminRoutes } from './admin';
import Layout from '@/components/Layout';

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
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute>
        <ListCar />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [...routes, adminRoutes],
  },
]);
