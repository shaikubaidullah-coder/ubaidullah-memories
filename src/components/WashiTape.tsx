'use client';

import React from 'react';

interface WashiTapeProps {
  className?: string;
  color?: 'yellow' | 'pink' | 'blue' | 'green';
  tilt?: number;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  className = '',
  color = 'yellow',
  tilt = -3,
}) => {
  const colorStyles = {
    yellow: 'bg-accent-yellow/60 border-accent-yellow/40 text-accent-yellow',
    pink: 'bg-accent-pink/60 border-accent-pink/40 text-accent-pink',
    blue: 'bg-accent-blue/60 border-accent-blue/40 text-accent-blue',
    green: 'bg-accent-green/60 border-accent-green/40 text-accent-green',
  }[color] || 'bg-accent-yellow/60 border-accent-yellow/40';

  return (
    <div
      className={`absolute h-7 w-24 washi-tape flex items-center justify-center pointer-events-none select-none z-20 ${colorStyles} ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    />
  );
};
