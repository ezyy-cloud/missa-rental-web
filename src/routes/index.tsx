import { Navigate, createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { adminRoutes } from './admin';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load components
const Home = lazy(() => import('@/pages/Home'));
const BrowseCars = lazy(() => import('@/pages/BrowseCars'));
const CarDetails = lazy(() => import('@/pages/CarDetails'));
const ListCar = lazy(() => import('@/pages/ListCar'));
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const Profile = lazy(() => import('@/pages/Profile'));

// Wrap component with Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const routes = [
  {
    path: '/',
    element: withSuspense(Home),
  },
  {
    path: '/sign-in',
    element: withSuspense(SignIn),
  },
  {
    path: '/sign-up',
    element: withSuspense(SignUp),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        {withSuspense(Profile)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/cars',
    element: withSuspense(BrowseCars),
  },
  {
    path: '/cars/:id',
    element: withSuspense(CarDetails),
  },
  {
    path: '/list-car',
    element: (
      <ProtectedRoute>
        {withSuspense(ListCar)}
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
