import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, profile, initialized } = useAuthStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuthorization() {
      if (!initialized) {
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        if (requireAdmin) {
          if (profile) {
            setIsAuthorized(profile.role === 'admin');
          } else {
            // Fetch profile if not available
            const { data, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();

            if (error) throw error;
            setIsAuthorized(data?.role === 'admin');
          }
        } else {
          // For regular protected routes, just having a user is enough
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthorization();
  }, [user, profile, requireAdmin, initialized]);

  // Wait for auth to initialize
  if (!initialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    // Redirect them to the sign-in page, but save the attempted location
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
