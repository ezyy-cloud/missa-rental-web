import React from 'react';

interface AppStoreIconProps {
  className?: string;
}

export function AppleAppStore({ className }: AppStoreIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.38 4.38 0 0 0-3 1.52 4.09 4.09 0 0 0-1 3.09 3.64 3.64 0 0 0 2.94-1.42z"
        className="fill-current"
      />
      <path
        d="M19.5 12.52a4.87 4.87 0 0 1 2.33-4.09 5 5 0 0 0-3.95-2.14c-1.68-.17-3.28 1-4.13 1-.86 0-2.18-1-3.59-1a5.23 5.23 0 0 0-4.41 2.68c-1.88 3.27-.48 8.1 1.35 10.76.89 1.29 1.95 2.74 3.35 2.69 1.34-.05 1.85-.87 3.47-.87 1.61 0 2.07.87 3.48.84 1.44-.02 2.35-1.31 3.23-2.61a11.11 11.11 0 0 0 1.46-3A4.74 4.74 0 0 1 19.5 12.52z"
        className="fill-current"
      />
    </svg>
  );
}

export function GooglePlayStore({ className }: AppStoreIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.609 2.324A1.5 1.5 0 0 0 2 3.707v16.586a1.5 1.5 0 0 0 1.609 1.383l11-1.687V4.01l-11-1.687z"
        className="fill-current"
        opacity="0.8"
      />
      <path
        d="M14.609 4.01v15.979l6.891-7.99-6.891-7.99z"
        className="fill-current"
        opacity="0.6"
      />
      <path
        d="M14.609 4.01L3.609 2.324a1.5 1.5 0 0 0-1.109.5l11.109 8.175 7-8.175a1.5 1.5 0 0 0-1.109-.5L14.609 4.01z"
        className="fill-current"
        opacity="0.9"
      />
      <path
        d="M2.5 21.176a1.5 1.5 0 0 0 1.109.5l11-1.687v-8.99L3.5 19.176a1.5 1.5 0 0 0-1 2z"
        className="fill-current"
        opacity="0.7"
      />
    </svg>
  );
}
