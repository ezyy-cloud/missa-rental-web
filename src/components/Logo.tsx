import { useThemeStore } from '@/stores/themeStore';
import missaLogo from '@/assets/images/missa.svg';

interface LogoProps {
  className?: string;
}

export function Logo({ className = 'h-8 w-auto' }: LogoProps) {
  const { theme } = useThemeStore();

  return (
    <img
      src={missaLogo}
      alt="MISSA Logo"
      className={`${className} ${theme === 'dark' ? 'invert' : ''}`}
    />
  );
}
