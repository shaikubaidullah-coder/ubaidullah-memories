'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Envelope3D } from '../3d/Envelope3D';
import { DeskScene3D } from '../3d/DeskScene3D';
import { Doodle } from '../Doodles';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface IntroSceneProps {
  onOpenComplete: () => void;
  onEnvelopeOpen?: () => void;
}

export const IntroScene: React.FC<IntroSceneProps> = ({ onOpenComplete, onEnvelopeOpen }) => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);
  const [isWhiteFade, setIsWhiteFade] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [accentColor, setAccentColor] = useState('#D47A8F');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent-pink', accentColor);
  }, [accentColor]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const triggerOpen = useCallback(() => {
    if (isEnvelopeOpen || isProceeding) return;
    setIsEnvelopeOpen(true);
    SoundEngine.playPopClick();
    if (onEnvelopeOpen) onEnvelopeOpen();

    setTimeout(() => {
      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F3A3B4', '#F7E5A9', '#A2C2E1', '#B4CBB7'],
      });
      confetti({
        particleCount: 30,
        spread: 100,
        origin: { x: 0.2, y: 0.7 },
        colors: ['#F3A3B4', '#F7E5A9'],
      });
      confetti({
        particleCount: 30,
        spread: 100,
        origin: { x: 0.8, y: 0.7 },
        colors: ['#A2C2E1', '#B4CBB7'],
      });
    }, 800);
  }, [isEnvelopeOpen, isProceeding, onEnvelopeOpen]);

  const handleProceed = useCallback(() => {
    if (isProceeding) return;
    setIsProceeding(true);
    SoundEngine.playPopClick();
    setTimeout(() => setIsWhiteFade(true), 350);
    setTimeout(() => {
      onOpenComplete();
    }, 1000);
  }, [isProceeding, onOpenComplete]);

  // Direct enter bypass (skips waiting if user clicks direct enter)
  const handleDirectEnter = useCallback(() => {
    if (isProceeding) return;
    SoundEngine.playPopClick();
    setIsProceeding(true);
    setIsWhiteFade(true);
    setTimeout(() => {
      onOpenComplete();
    }, 500);
  }, [isProceeding, onOpenComplete]);

  // Global Keyboard Listener for Enter and Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isEnvelopeOpen) {
          triggerOpen();
        } else {
          handleProceed();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnvelopeOpen, triggerOpen, handleProceed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const themeColors = [
    { name: 'Warm Rose', hex: '#D47A8F' },
    { name: 'Sage Green', hex: '#89AC94' },
    { name: 'Sky Blue', hex: '#7EAFCE' },
    { name: 'Honey Yellow', hex: '#F2CA65' },
    { name: 'Kraft Brown', hex: '#BFA28F' },
  ];

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden select-none z-50">
      {/* 3D Canvas Scene */}
      <div className="absolute inset-0 w-full h-full bg-[#F8F1E7] overflow-hidden z-0">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 0, 7], fov: 45 }}
        >
          <DeskScene3D accentColor={accentColor} />
          <Envelope3D
            isOpen={isEnvelopeOpen}
            onOpenTrigger={triggerOpen}
            onProceed={handleProceed}
            accentColor={accentColor}
          />
        </Canvas>
      </div>

      {/* Top Left Theme Color Picker */}
      <div className="absolute top-4 left-4 flex items-center pointer-events-auto z-40">
        <button
          onClick={() => {
            SoundEngine.playPopClick();
            setShowColorPicker(!showColorPicker);
          }}
          className="w-10 h-10 rounded-full bg-white border border-text-ink/10 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-lg cursor-pointer"
          title="Pick theme color"
        >
          🎨
        </button>

        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              className="flex items-center gap-2 bg-white/95 border border-text-ink/10 rounded-full px-3 py-1.5 shadow-md ml-2"
              initial={{ opacity: 0, x: -15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -15, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              {themeColors.map((theme) => (
                <button
                  key={theme.hex}
                  onClick={() => {
                    setAccentColor(theme.hex);
                    SoundEngine.playPopClick();
                    showToast(`${theme.name} Theme ✨`);
                  }}
                  style={{ backgroundColor: theme.hex }}
                  className={`w-6 h-6 rounded-full border border-black/10 cursor-pointer transition-all hover:scale-115 active:scale-90 relative ${
                    accentColor === theme.hex ? 'ring-2 ring-zinc-800 ring-offset-1' : ''
                  }`}
                  title={theme.name}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Direct Quick Enter Button (Top Bar) */}
      <div className="absolute top-4.5 left-16 md:left-20 flex items-center gap-2 z-40 pointer-events-auto">
        <button
          onClick={handleDirectEnter}
          className="px-3 py-1.5 bg-white/80 hover:bg-white text-text-ink/75 hover:text-accent-pink rounded-full border border-text-ink/10 shadow-xs hover:shadow-md text-[10px] md:text-[11px] font-sans font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1 active:scale-95"
          title="Skip intro and enter directly"
        >
          <span>Enter Directly</span>
          <span>→</span>
        </button>
      </div>

      {/* Toast Notification */}
      <div className="absolute top-[20%] inset-x-0 flex justify-center pointer-events-none z-30">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="bg-white border border-text-ink/10 px-5 py-2 rounded-full shadow-lg text-xs font-handwritten font-extrabold text-accent-pink flex items-center gap-1.5"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <span>✨ {toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center Bird Banner */}
      {!isMobile && (
        <motion.div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-none z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4 },
            y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
          }}
        >
          {/* Blue Bird */}
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-[#A2C2E1] fill-current drop-shadow-md" viewBox="0 0 64 64">
              <path d="M48,20 C42,20 38,24 34,28 C32,26 28,24 24,24 C14,24 8,32 8,42 C8,48 14,52 20,52 C26,52 30,48 34,44 C38,48 42,50 48,50 C56,50 60,42 60,35 C60,27 56,20 48,20 Z" />
              <motion.path
                d="M30,34 C26,26 24,18 28,16 C32,14 36,22 34,30 Z"
                className="origin-bottom-left"
                animate={{ scaleY: [1, -0.6, 1], y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 0.22, ease: 'linear' }}
              />
              <polygon points="12,38 4,40 12,42" className="text-yellow-400 fill-current" />
              <circle cx="20" cy="34" r="2.5" className="text-zinc-800 fill-current" />
            </svg>
          </div>

          {/* Banner Card */}
          <div className="relative bg-white border-2 border-text-ink/10 px-10 py-4 rounded-[28px] shadow-md flex flex-col items-center justify-center min-w-[420px] text-center">
            <div className="absolute -left-8 top-[24px] w-8 h-[2px] border-t-2 border-dashed border-text-ink/30" />
            <div className="absolute -right-8 top-[24px] w-8 h-[2px] border-t-2 border-dashed border-text-ink/30" />
            <span className="font-handwritten text-2xl md:text-3xl text-accent-pink font-extrabold block mb-0.5">
              {memoriesConfig.intro.cardGreeting}
            </span>
            <span className="font-sans text-xs text-text-ink/75 font-bold tracking-wide">
              {memoriesConfig.intro.cardSubtext}
            </span>
          </div>

          {/* Pink Bird */}
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-[#F3A3B4] fill-current scale-x-[-1] drop-shadow-md" viewBox="0 0 64 64">
              <path d="M48,20 C42,20 38,24 34,28 C32,26 28,24 24,24 C14,24 8,32 8,42 C8,48 14,52 20,52 C26,52 30,48 34,44 C38,48 42,50 48,50 C56,50 60,42 60,35 C60,27 56,20 48,20 Z" />
              <motion.path
                d="M30,34 C26,26 24,18 28,16 C32,14 36,22 34,30 Z"
                className="origin-bottom-left"
                animate={{ scaleY: [1, -0.6, 1], y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 0.25, ease: 'linear' }}
              />
              <polygon points="12,38 4,40 12,42" className="text-yellow-400 fill-current" />
              <circle cx="20" cy="34" r="2.5" className="text-zinc-800 fill-current" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Bottom Action Area with Clear "ENTER" Controls */}
      <div className="absolute bottom-8 md:bottom-10 w-full flex flex-col items-center justify-center z-30 pointer-events-none px-4">
        <AnimatePresence mode="wait">
          {!isEnvelopeOpen ? (
            /* STATE 1: Envelope is closed — Big Prominent "ENTER SCRAPBOOK" button */
            <motion.div
              key="closed-controls"
              className="flex flex-col items-center gap-2 pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={triggerOpen}
                className="px-8 py-3.5 bg-white text-text-ink hand-drawn-border font-bold text-sm md:text-base shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2.5 transition-all text-accent-pink hover:scale-105 active:scale-95 group relative"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <span className="text-lg">✉️</span>
                <span className="tracking-wide uppercase font-extrabold font-sans">
                  {memoriesConfig.intro.envelopeButtonText}
                </span>
                <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
              </motion.button>

              <div className="flex items-center gap-2 text-[11px] font-sans font-medium text-text-ink/65 tracking-wide bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-text-ink/10 shadow-2xs">
                <span>✦ Click anywhere on envelope or press <kbd className="px-1.5 py-0.5 bg-zinc-200 text-zinc-800 rounded font-mono font-bold text-[10px]">Enter ↵</kbd></span>
              </div>

              <div className="relative w-full h-4 mt-0.5 pointer-events-none flex justify-center gap-24">
                <Doodle type="sparkle" className="w-4 h-4 opacity-50" color="yellow" />
                <Doodle type="sparkle" className="w-4 h-4 opacity-50" color="green" />
              </div>
            </motion.div>
          ) : (
            /* STATE 2: Envelope is open — Unmissable glowing "ENTER SCRAPBOOK" CTA */
            <motion.div
              key="open-controls"
              className="flex flex-col items-center gap-2 pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.button
                onClick={handleProceed}
                className="px-9 py-3.5 bg-accent-pink text-white font-sans font-extrabold text-sm md:text-base rounded-full shadow-xl hover:shadow-2xl cursor-pointer flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 animate-pulse"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>ENTER SCRAPBOOK</span>
                <span className="text-lg">→</span>
              </motion.button>

              <div className="flex items-center gap-2 text-[11px] font-sans font-medium text-text-ink/70 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-text-ink/10 shadow-2xs">
                <span>✦ Press <kbd className="px-1.5 py-0.5 bg-zinc-200 text-zinc-800 rounded font-mono font-bold text-[10px]">Enter ↵</kbd> or click button above to enter</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* White Flash Transition to Scene 2 */}
      <AnimatePresence>
        {isWhiteFade && (
          <motion.div
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
