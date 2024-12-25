import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { Moon, Sun } from 'lucide-react';
import missaLogo from '../assets/images/missa.svg';

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
        <div className="flex">
            <Link to="/" className="flex items-center">
              <img src={missaLogo} alt="MISSA Logo" className="h-8 w-auto" />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/browse" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light">
              Browse Cars
            </Link>
            {user ? (
              <>
                <Link to="/list-car" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light">
                  List Your Car
                </Link>
                <Link to="/profile" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light">
                  Profile
                </Link>
                <Button onClick={signOut} variant="secondary">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="secondary">Sign In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button variant="yellow">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}