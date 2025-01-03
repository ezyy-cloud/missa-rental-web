import React from 'react';
import { cn } from '../../utils/cn';
import { useThemeStore } from '@/stores/themeStore';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  const { theme } = useThemeStore();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400",
          theme === 'dark' && "[color-scheme:dark]",
          error && "border-red-500 dark:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}