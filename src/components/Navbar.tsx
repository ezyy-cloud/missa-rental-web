import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/themeStore';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { user, profile, signOut } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-black shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-black"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/cars" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light">
              Browse Cars
            </Link>

            {user ? (
              <>
                <Link to="/list-car" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light">
                  List Your Car
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name || 'Profile'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-black flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-black border-gray-200 dark:border-gray-700">
                    <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-gray-700">
                      <Link to="/profile" className="w-full text-gray-700 dark:text-gray-200">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="text-red-600 dark:text-red-400 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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