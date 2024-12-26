import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminUsers } from '../pages/admin/Users';
import { AdminCars } from '../pages/admin/Cars';
import { AdminBookings } from '../pages/admin/Bookings';
import { AdminSettings } from '../pages/admin/Settings';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export const adminRoutes = {
  path: '/admin',
  element: (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
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
      path: 'settings',
      element: <AdminSettings />,
    },
  ],
};
