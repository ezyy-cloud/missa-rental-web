import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export function Slider({ min, max, step = 1, value, onChange, className }: SliderProps) {
  const [isDragging, setIsDragging] = useState<number | null>(null); // 0 for left thumb, 1 for right
  const trackRef = useRef<HTMLDivElement>(null);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const getValue = (percentage: number) => {
    const rawValue = (percentage / 100) * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  };

  const handleMouseDown = (e: React.MouseEvent, thumbIndex: number) => {
    e.preventDefault();
    setIsDragging(thumbIndex);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging === null || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
    const newValue = getValue(percentage);

    const newValues: [number, number] = [...value];
    newValues[isDragging] = newValue;

    // Ensure left thumb doesn't cross right thumb and vice versa
    if (isDragging === 0 && newValue <= value[1]) {
      onChange([newValue, value[1]]);
    } else if (isDragging === 1 && newValue >= value[0]) {
      onChange([value[0], newValue]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const newValue = getValue(percentage);

    const newValues: [number, number] = [...value];
    if (Math.abs(newValue - value[0]) < Math.abs(newValue - value[1])) {
      newValues[0] = newValue;
    } else {
      newValues[1] = newValue;
    }

    onChange(newValues);
  };

  const handleTouchStart = (e: React.TouchEvent, thumbIndex: number) => {
    e.preventDefault();
    setIsDragging(thumbIndex);
  };

  useEffect(() => {
    if (isDragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, value]);

  return (
    <div className={cn("relative w-full h-6 flex items-center", className)}>
      <div
        ref={trackRef}
        className={cn(
          "relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer",
          className
        )}
        onClick={handleTrackClick}
      >
        {/* Track fill */}
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{
            left: `${getPercentage(value[0])}%`,
            width: `${getPercentage(value[1]) - getPercentage(value[0])}%`
          }}
        />

        {/* Left thumb */}
        <div
          className={cn(
            "absolute w-4 h-4 bg-white dark:bg-gray-200 border-2 border-primary rounded-full -translate-x-1/2 -translate-y-1/4 cursor-grab focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            isDragging === 0 && "cursor-grabbing"
          )}
          style={{ left: `${getPercentage(value[0])}%` }}
          onMouseDown={(e) => handleMouseDown(e, 0)}
          onTouchStart={(e) => handleTouchStart(e, 0)}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={value[1]}
          aria-valuenow={value[0]}
          tabIndex={0}
        />

        {/* Right thumb */}
        <div
          className={cn(
            "absolute w-4 h-4 bg-white dark:bg-gray-200 border-2 border-primary rounded-full -translate-x-1/2 -translate-y-1/4 cursor-grab focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            isDragging === 1 && "cursor-grabbing"
          )}
          style={{ left: `${getPercentage(value[1])}%` }}
          onMouseDown={(e) => handleMouseDown(e, 1)}
          onTouchStart={(e) => handleTouchStart(e, 1)}
          role="slider"
          aria-valuemin={value[0]}
          aria-valuemax={max}
          aria-valuenow={value[1]}
          tabIndex={0}
        />
      </div>
    </div>
  );
}
