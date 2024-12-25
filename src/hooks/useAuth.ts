import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function useAuth(requireAuth = true) {
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      navigate('/signin', { state: { from: window.location.pathname } });
    }
  }, [user, loading, requireAuth, navigate]);

  return { user, loading };
}

export function useRequireAuth() {
  return useAuth(true);
}

export function useOptionalAuth() {
  return useAuth(false);
}