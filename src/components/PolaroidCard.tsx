'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { WashiTape } from './WashiTape';
import { SoundEngine } from '@/utils/audio';

interface PolaroidCardProps {
  src: string;
  caption: string;
  date: string;
  rotation?: number;
  tapeColor?: 'yellow' | 'pink' | 'blue' | 'green';
  tapePosition?: 'top-center' | 'top-left' | 'top-right';
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  src,
  caption,
  date,
  rotation = 0,
  tapeColor = 'yellow',
  tapePosition = 'top-center',
  className = '',
  interactive = true,
  onClick,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    SoundEngine.playPaperRustle();
    if (onClick) {
      onClick();
    } else if (interactive) {
      setIsZoomed(!isZoomed);
    }
  };

  const tapePositions = {
    'top-center': '-top-3.5 left-1/2 -translate-x-1/2',
    'top-left': '-top-3.5 left-2',
    'top-right': '-top-3.5 right-2',
  }[tapePosition];

  return (
    <>
      <motion.div
        className={`relative bg-[#FFFDF9] p-3 pb-5 rounded-xs border border-zinc-200/70 polaroid-shadow select-none group transition-shadow ${
          interactive ? 'cursor-pointer hover:shadow-2xl' : ''
        } ${className}`}
        style={{
          rotate: rotation,
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        whileHover={interactive ? { scale: 1.04, y: -4 } : {}}
        whileTap={interactive ? { scale: 0.98 } : {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <WashiTape color={tapeColor} className={tapePositions} tilt={rotation > 0 ? -4 : 4} />

        <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden border border-zinc-200/60 rounded-xs mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={caption}
            onError={() => {
              // Try alternate extension (.png <-> .jpg)
              if (imgSrc.endsWith('.jpg')) {
                setImgSrc(imgSrc.replace('.jpg', '.png'));
              } else if (imgSrc.endsWith('.png')) {
                setImgSrc(imgSrc.replace('.png', '.jpg'));
              }
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 opacity-30 pointer-events-none" />
        </div>

        <div className="flex flex-col gap-1 text-center px-1">
          <p className="font-handwritten text-xs md:text-sm text-text-ink/90 font-bold leading-tight">
            {caption}
          </p>
          <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-widest text-text-ink/40 font-semibold">
            {date}
          </span>
        </div>
      </motion.div>

      {/* Fullscreen Zoom Lightbox */}
      {isZoomed && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsZoomed(false)}
        >
          <motion.div
            className="relative bg-white p-4 pb-6 rounded-sm max-w-md w-full shadow-2xl max-h-[90dvh] overflow-y-auto"
            initial={{ scale: 0.8, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden rounded-xs mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgSrc} alt={caption} className="w-full h-full object-cover" />
            </div>
            <p className="font-handwritten text-lg text-center text-text-ink font-bold">{caption}</p>
            <p className="text-center font-sans text-xs uppercase tracking-widest text-text-ink/50 mt-1">{date}</p>
            <button
              onClick={() => setIsZoomed(false)}
              className="mt-4 mx-auto block px-4 py-1.5 rounded-full bg-accent-pink text-white text-xs font-bold"
            >
              Close ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
