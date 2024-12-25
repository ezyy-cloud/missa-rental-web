import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './components/auth/AuthProvider';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
import BrowseCarsPage from './pages/BrowseCars';
import CarDetailsPage from './pages/CarDetails';
import ListCarPage from './pages/ListCar';
import SignInPage from './pages/auth/SignIn';
import SignUpPage from './pages/auth/SignUp';
import ProfilePage from './pages/Profile';

// Configure future flags for React Router v7
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <HelmetProvider>
          <Router {...routerOptions}>
            <AuthProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowseCarsPage />} />
                <Route path="/cars/:id" element={<CarDetailsPage />} />
                <Route path="/list-car" element={<ListCarPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </AuthProvider>
          </Router>
        </HelmetProvider>
      </div>
    </div>
  );
}

export default App;