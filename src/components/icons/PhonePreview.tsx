import React from 'react';

interface PhonePreviewProps {
  className?: string;
}

export function PhonePreview({ className }: PhonePreviewProps) {
  return (
    <svg
      viewBox="0 0 320 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Phone Frame */}
      <rect
        x="10"
        y="10"
        width="300"
        height="620"
        rx="40"
        className="fill-white dark:fill-dark-lighter stroke-gray-200 dark:stroke-gray-700"
        strokeWidth="4"
      />
      
      {/* Screen */}
      <rect
        x="20"
        y="40"
        width="280"
        height="560"
        rx="20"
        className="fill-gray-100 dark:fill-black"
      />
      
      {/* Notch */}
      <rect
        x="100"
        y="20"
        width="120"
        height="12"
        rx="6"
        className="fill-gray-200 dark:fill-gray-700"
      />
      
      {/* Home Indicator */}
      <rect
        x="120"
        y="610"
        width="80"
        height="4"
        rx="2"
        className="fill-gray-300 dark:fill-gray-600"
      />
      
      {/* App Content Preview */}
      <rect x="40" y="80" width="240" height="60" rx="8" className="fill-primary/10" />
      <rect x="40" y="160" width="240" height="120" rx="8" className="fill-primary/20" />
      <rect x="40" y="300" width="240" height="80" rx="8" className="fill-primary/10" />
      <rect x="40" y="400" width="240" height="160" rx="8" className="fill-primary/20" />
    </svg>
  );
}
