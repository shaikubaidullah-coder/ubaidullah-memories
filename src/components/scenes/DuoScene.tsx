'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PolaroidCard } from '../PolaroidCard';
import { Doodle } from '../Doodles';
import { Sticker } from '../Sticker';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface DuoSceneProps {
  onContinue: () => void;
}

export const DuoScene: React.FC<DuoSceneProps> = ({ onContinue }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { title, subtitle, polaroids, receipt, stickyNoteText, footerLabel, swipeLabel } = memoriesConfig.duo;
  const hero1 = polaroids[0];
  const hero2 = polaroids[1];
  const hero3 = polaroids[2];

  const handleNext = () => {
    SoundEngine.playPaperRustle();
    setIsExiting(true);
    setTimeout(() => {
      onContinue();
    }, 1100);
  };

  return (
    <div className="relative w-full min-h-screen bg-paper overflow-hidden flex flex-col justify-start items-center py-6 px-4 md:py-10 md:px-8 select-none">
      {/* White Entry Flash Fade */}
      <motion.div
        className="fixed inset-0 bg-white z-[90] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {/* Ambient Lighting Drift */}
      <div
        className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-25"
        style={{
          background: 'radial-gradient(circle at 35% 45%, #F3A3B4 0%, transparent 60%)',
          animation: 'ambientLightDrift 18s ease-in-out infinite alternate',
        }}
      />
      <style jsx global>{`
        @keyframes ambientLightDrift {
          0% {
            background-position: 0% 0%;
            filter: hue-rotate(0deg);
          }
          100% {
            background-position: 100% 100%;
            filter: hue-rotate(15deg);
          }
        }
      `}</style>

      {/* Floating Sparkles & Dust Motes */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent-pink/20"
            style={{
              top: `${20 + 15 * i}%`,
              left: `${15 + 20 * Math.sin(i) + 30}%`,
            }}
            animate={{
              y: [0, -35, -70],
              x: [0, 10 * Math.sin(i), 0],
              opacity: [0, 0.45, 0],
            }}
            transition={{
              duration: 8 + (i % 3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4 * i,
            }}
          />
        ))}
      </div>

      {/* Coffee Stain Doodle */}
      <div className="absolute left-[6%] top-[8%] opacity-20 pointer-events-none select-none hidden lg:block z-0">
        <svg viewBox="0 0 100 100" className="w-28 h-28 text-amber-900/60 fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
          <path d="M52,8 C27,10 8,28 9,53 C10,79 32,94 57,91 C80,88 93,65 91,42 C89,20 63,7 44,14 C29,19 19,39 23,55" />
        </svg>
      </div>

      {/* Background Handwritten Whispers */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex flex-col justify-between p-16 select-none">
          <span className="font-handwritten text-4xl text-text-ink/5 rotate-[-12deg] w-max mt-4">the good old days</span>
          <span className="font-handwritten text-5xl text-text-ink/5 rotate-[8deg] w-max self-end mr-12">core memories</span>
          <span className="font-handwritten text-4xl text-text-ink/5 rotate-[-6deg] w-max ml-20 mb-16">remember when...</span>
        </div>
      )}

      {/* Main Container */}
      <motion.div
        className="w-full flex-grow relative flex flex-col justify-between items-center z-20"
        initial={{ x: '50vw', opacity: 0.6 }}
        animate={{
          x: isExiting ? '-100vw' : 0,
          rotateY: isExiting ? -90 : 0,
          opacity: isExiting ? 0 : 1,
        }}
        transition={{
          duration: isExiting ? 1.0 : 1.4,
          ease: isExiting ? 'easeIn' : [0.16, 1, 0.3, 1],
        }}
      >
        {/* Title Header */}
        <div className="w-full max-w-lg text-center mt-2 md:mt-4 z-30">
          <motion.h1
            className="font-handwritten text-3xl md:text-5xl font-black tracking-tight text-accent-pink"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="font-sans text-xs md:text-sm font-bold uppercase tracking-wider text-text-ink/65 mt-1.5"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Center Polaroids & Scrapbook Artifacts */}
        <div className="relative flex flex-col items-center justify-center my-8 md:my-12">
          {/* Mobile Swiper / Dots */}
          {isMobile ? (
            <div className="relative w-[240px] aspect-[1/1.25] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ x: 100, opacity: 0, rotate: 6 }}
                  animate={{ x: 0, opacity: 1, rotate: polaroids[activeSlide]?.rotation || 0 }}
                  exit={{ x: -100, opacity: 0, rotate: -6 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  className="w-full h-full absolute"
                >
                  {polaroids[activeSlide] && (
                    <PolaroidCard
                      src={polaroids[activeSlide].src}
                      caption={polaroids[activeSlide].caption}
                      date={polaroids[activeSlide].date}
                      rotation={0}
                      tapeColor={activeSlide % 2 === 0 ? 'yellow' : 'pink'}
                      tapePosition="top-center"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Desktop Stacked Polaroids Layout */
            <div className="relative flex items-center justify-center">
              {/* Left Polaroid */}
              {hero2 && (
                <motion.div
                  className="absolute right-[calc(100%+2.5rem)] top-1/2 -translate-y-1/2 w-[210px] z-20 pointer-events-auto"
                  initial={{ x: -80, opacity: 0, rotate: -15 }}
                  animate={{ x: 0, opacity: 0.95, rotate: -8 }}
                  transition={{ type: 'spring', stiffness: 85, damping: 18, delay: 0.8 }}
                >
                  <PolaroidCard
                    src={hero2.src}
                    caption={hero2.caption}
                    date={hero2.date}
                    rotation={-8}
                    tapeColor="pink"
                    tapePosition="top-left"
                  />
                </motion.div>
              )}

              {/* Center Main Polaroid */}
              {hero1 && (
                <motion.div
                  className="w-[260px] pointer-events-auto relative z-30"
                  initial={{ y: 120, opacity: 0, scale: 0.9, rotate: -6 }}
                  animate={{ y: 0, opacity: 1, scale: 1, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.5 }}
                >
                  <PolaroidCard
                    src={hero1.src}
                    caption={hero1.caption}
                    date={hero1.date}
                    rotation={-2}
                    tapeColor="yellow"
                    tapePosition="top-center"
                  />
                </motion.div>
              )}

              {/* Right Polaroid */}
              {hero3 && (
                <motion.div
                  className="absolute left-[calc(100%+2.5rem)] top-1/2 -translate-y-1/2 w-[210px] z-20 pointer-events-auto"
                  initial={{ x: 80, opacity: 0, rotate: 15 }}
                  animate={{ x: 0, opacity: 0.95, rotate: 6 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 1.0 }}
                >
                  <PolaroidCard
                    src={hero3.src}
                    caption={hero3.caption}
                    date={hero3.date}
                    rotation={6}
                    tapeColor="blue"
                    tapePosition="top-right"
                  />
                </motion.div>
              )}

              {/* Sticky Note on Left */}
              <motion.div
                className="absolute left-[-220px] bottom-[-90px] bg-[#FAF8F5] border border-[#E5DEC9] shadow-sm p-3.5 rotate-[-5deg] w-[140px] pointer-events-auto cursor-pointer z-30"
                whileHover={{ scale: 1.06, rotate: -2, y: -4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                onClick={() => SoundEngine.playPaperRustle()}
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-4 bg-yellow-200/50 rotate-[3deg] shadow-xs border border-yellow-300/20" />
                <p className="font-handwritten text-xs text-text-ink/85 leading-relaxed whitespace-pre-line">
                  {stickyNoteText}
                </p>
              </motion.div>

              {/* Cafe Receipt on Left */}
              <motion.div
                className="absolute left-[-440px] bottom-[-130px] bg-[#FDFBF7] border border-gray-200/60 shadow-xs p-3.5 w-[120px] rotate-[10deg] pointer-events-auto font-mono text-[9px] text-zinc-600 leading-normal hidden lg:block z-20"
                whileHover={{ scale: 1.05, rotate: 12, y: -2 }}
                onClick={() => SoundEngine.playPaperRustle()}
              >
                <div className="absolute -top-2.5 left-6 w-8 h-3.5 bg-red-200/40 rotate-[-5deg] border border-dashed border-red-300/20" />
                <div className="text-center font-bold border-b border-dashed border-zinc-300 pb-1 mb-1.5 text-accent-pink">
                  {receipt.storeName}
                </div>
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[8px]">
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-zinc-300 mt-1.5 pt-1 font-bold flex justify-between text-[8px]">
                  <span>TOTAL</span>
                  <span>{receipt.total}</span>
                </div>
                <div className="text-[7px] text-zinc-400 mt-2 text-center">{receipt.footerNote}</div>
              </motion.div>

              {/* Photobooth Strip on Right */}
              <motion.div
                className="absolute right-[-440px] top-[-100px] bg-[#FAF8F5] border border-gray-200/80 shadow-md p-2 w-[85px] flex flex-col gap-2 rotate-[8deg] pointer-events-auto hidden lg:flex z-20"
                whileHover={{ scale: 1.06, rotate: 4, y: -4 }}
                transition={{ type: 'spring', stiffness: 180, damping: 15 }}
                onClick={() => SoundEngine.playPaperRustle()}
              >
                <div className="absolute -top-2.5 left-4 w-7 h-3.5 bg-sky-200/50 rotate-[-12deg] border border-sky-300/20 shadow-xs" />
                {[hero2?.src, hero1?.src, hero3?.src].map((imgSrc, i) => (
                  <div key={i} className="aspect-[4/3] bg-zinc-100 border border-zinc-200/50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgSrc || hero1.src} className="object-cover w-full h-full grayscale opacity-80" alt="" />
                  </div>
                ))}
                <div className="text-[7px] font-mono text-zinc-400 text-center uppercase tracking-widest pb-0.5">
                  smile! ⚡
                </div>
              </motion.div>

              {/* Decorative Stickers */}
              <div className="absolute inset-0 pointer-events-none z-30 hidden md:block">
                <Doodle type="star" className="absolute -top-12 -left-16 w-8 h-8" color="yellow" delay={0.8} />
                <Doodle type="heart" className="absolute -bottom-10 -right-16 w-9 h-9" color="pink" delay={1.0} />
                <Sticker emoji="💖" className="absolute right-[calc(100%+6rem)] -top-6 scale-90" rotation={12} />
                <Sticker emoji="☕" className="absolute left-[calc(100%+6rem)] -bottom-6 scale-90" rotation={-15} />
              </div>
            </div>
          )}

          {/* Mobile slide indicator dots */}
          {isMobile && (
            <div className="flex gap-2.5 justify-center mt-6 z-40 relative">
              {polaroids.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    SoundEngine.playPopClick();
                    setActiveSlide(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'bg-accent-pink scale-125 shadow-sm' : 'bg-text-ink/20'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Labels & Continue Button */}
        <div className="w-full flex flex-col items-center gap-3 z-30 pb-4">
          <span className="font-handwritten text-xs md:text-sm text-text-ink/65 italic select-none">
            {isMobile ? swipeLabel : footerLabel}
          </span>
          <motion.button
            onClick={handleNext}
            className="px-8 py-3 bg-[#FFFDF9] text-text-ink hand-drawn-border font-handwritten text-lg md:text-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all hover:text-accent-pink flex items-center gap-2 cursor-pointer group"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Continue our story →</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
