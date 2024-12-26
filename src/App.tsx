import { useRoutes } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import Navbar from './components/Navbar';
import { routes } from './routes';
import { adminRoutes } from './routes/admin';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const routing = useRoutes([...routes, ...adminRoutes]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {routing}
    </div>
  );
}

export default App;