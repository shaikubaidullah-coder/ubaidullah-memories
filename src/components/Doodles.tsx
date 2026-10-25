'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DoodleProps {
  type: 'heart' | 'star' | 'sparkle';
  className?: string;
  color?: 'pink' | 'yellow' | 'blue' | 'green' | 'ink';
  duration?: number;
  delay?: number;
}

export const Doodle: React.FC<DoodleProps> = ({
  type,
  className = '',
  color = 'ink',
  duration = 0.8,
  delay = 0.2,
}) => {
  const colorMap = {
    pink: '#F3A3B4',
    yellow: '#F7E5A9',
    blue: '#A2C2E1',
    green: '#B4CBB7',
    ink: '#2C2520',
  };

  const strokeColor = colorMap[color] || '#2C2520';

  const drawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: 'easeInOut',
      },
    },
  };

  if (type === 'heart') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        <motion.path
          d="M50,85 C20,60 5,40 10,22 C15,5 35,5 50,25 C65,5 85,5 90,22 C95,40 80,60 50,85 Z"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
    );
  }

  if (type === 'star') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        <motion.path
          d="M50,10 L62,38 L92,42 L70,62 L76,92 L50,77 L24,92 L30,62 L8,42 L38,38 Z"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
    );
  }

  // Sparkle
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <motion.path
        d="M50,5 Q50,50 95,50 Q50,50 50,95 Q50,50 5,50 Q50,50 50,5 Z"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={drawVariants}
        initial="hidden"
        animate="visible"
      />
    </svg>
  );
};
