'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StickerProps {
  emoji: string;
  className?: string;
  rotation?: number;
  scale?: number;
}

export const Sticker: React.FC<StickerProps> = ({
  emoji,
  className = '',
  rotation = 0,
  scale = 1,
}) => {
  return (
    <motion.div
      className={`inline-flex items-center justify-center p-2.5 bg-white rounded-full border-2 border-white/80 shadow-md cursor-pointer select-none origin-center pointer-events-auto ${className}`}
      style={{ rotate: `${rotation}deg`, scale }}
      initial={{ scale: 0, opacity: 0, rotate: rotation - 20 }}
      whileInView={{ scale, opacity: 1, rotate: rotation }}
      whileHover={{ scale: scale * 1.15, rotate: rotation + 10 }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <span className="text-xl md:text-2xl leading-none">{emoji}</span>
    </motion.div>
  );
};
