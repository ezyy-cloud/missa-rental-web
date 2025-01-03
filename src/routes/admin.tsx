import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminUsers } from '../pages/admin/Users';
import { AdminCars } from '../pages/admin/Cars';
import { AdminBookings } from '../pages/admin/Bookings';
import { AdminSecurity } from '../pages/admin/Security';
import { AdminSettings } from '../pages/admin/Settings';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const adminRoutes = {
  path: '/admin',
  element: (
    <ProtectedRoute requireAdmin>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <AdminDashboard />,
    },
    {
      path: 'users',
      element: <AdminUsers />,
    },
    {
      path: 'cars',
      element: <AdminCars />,
    },
    {
      path: 'bookings',
      element: <AdminBookings />,
    },
    {
      path: 'security',
      element: <AdminSecurity />,
    },
    {
      path: 'settings',
      element: <AdminSettings />,
    },
  ],
};
