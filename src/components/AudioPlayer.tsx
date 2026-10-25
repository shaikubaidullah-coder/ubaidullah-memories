'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, CloudRain, Flame, Music, Disc } from 'lucide-react';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface AudioPlayerProps {
  scene: string;
  autoPlayTrigger?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ scene = 'intro', autoPlayTrigger = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [ambientChannel, setAmbientChannel] = useState<'off' | 'lofi' | 'rain' | 'crackle'>('off');
  const [showAmbientMenu, setShowAmbientMenu] = useState(false);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowToast(false);
        })
        .catch((e) => console.log('Autoplay blocked:', e));
    }
  }, [autoPlayTrigger]);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowToast(true), 2500);
    const timer2 = setTimeout(() => setShowToast(false), 8000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (['letter', 'rocket', 'sky'].includes(scene)) {
        audioRef.current.volume = 0.25;
      } else {
        audioRef.current.volume = 0.55;
      }
    }
  }, [scene]);

  const toggleMusic = () => {
    SoundEngine.playPopClick();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowToast(false);
        })
        .catch((e) => console.log('Playback error:', e));
    }
  };

  const handleAmbientChange = (ch: 'off' | 'lofi' | 'rain' | 'crackle') => {
    SoundEngine.playPopClick();
    setAmbientChannel(ch);
    SoundEngine.setChannel(ch);
  };

  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[99] pointer-events-auto flex items-center gap-3">
      {/* Toast Prompt */}
      <AnimatePresence>
        {showToast && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-accent-pink/30 shadow-md text-[10px] font-sans font-bold text-accent-pink tracking-wider whitespace-nowrap select-none flex items-center gap-1.5"
          >
            <span>{memoriesConfig.music.title}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={memoriesConfig.music.url} loop preload="auto" />

      {/* Ambient Sound Mode Switcher */}
      <div className="relative">
        <button
          onClick={() => {
            SoundEngine.playPopClick();
            setShowAmbientMenu(!showAmbientMenu);
          }}
          className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-md border shadow-md hover:shadow-lg transition-all text-xs font-bold cursor-pointer ${
            ambientChannel !== 'off' ? 'border-accent-pink text-accent-pink' : 'border-text-ink/10 text-text-ink/70'
          }`}
          title="Ambient Soundscape (Lofi, Rain, Vinyl)"
        >
          {ambientChannel === 'lofi' ? <Disc className="w-4 h-4 animate-spin" /> :
           ambientChannel === 'rain' ? <CloudRain className="w-4 h-4" /> :
           ambientChannel === 'crackle' ? <Flame className="w-4 h-4" /> :
           <Volume2 className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showAmbientMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 bg-white/95 backdrop-blur-md border border-text-ink/10 rounded-2xl shadow-xl p-2 flex flex-col gap-1 min-w-[130px] z-50 text-xs font-sans font-bold"
            >
              <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-text-ink/40">Ambient Sound</div>
              <button
                onClick={() => handleAmbientChange('off')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-colors ${
                  ambientChannel === 'off' ? 'bg-accent-pink/15 text-accent-pink' : 'hover:bg-zinc-100 text-text-ink'
                }`}
              >
                <span>Mute Ambient</span>
              </button>
              <button
                onClick={() => handleAmbientChange('lofi')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-colors ${
                  ambientChannel === 'lofi' ? 'bg-accent-pink/15 text-accent-pink' : 'hover:bg-zinc-100 text-text-ink'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Lofi Synth</span>
              </button>
              <button
                onClick={() => handleAmbientChange('rain')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-colors ${
                  ambientChannel === 'rain' ? 'bg-accent-pink/15 text-accent-pink' : 'hover:bg-zinc-100 text-text-ink'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Gentle Rain</span>
              </button>
              <button
                onClick={() => handleAmbientChange('crackle')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-colors ${
                  ambientChannel === 'crackle' ? 'bg-accent-pink/15 text-accent-pink' : 'hover:bg-zinc-100 text-text-ink'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Vinyl Crackle</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Music Button */}
      <motion.button
        onClick={toggleMusic}
        className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-md border shadow-md hover:shadow-lg transition-all duration-300 relative cursor-pointer group text-text-ink ${
          isPlaying ? 'border-accent-pink/50' : 'border-text-ink/10'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {!isPlaying && (
          <span className="absolute inset-0 rounded-xl border border-accent-pink/40 animate-ping opacity-60 pointer-events-none" />
        )}

        {isPlaying ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Equalizer animation */}
            <div className="absolute inset-2 flex items-end justify-center gap-[2px] opacity-25">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-[2.5px] bg-accent-pink rounded-full"
                  animate={{ height: ['20%', '100%', '20%'] }}
                  transition={{
                    duration: 0.4 + 0.1 * i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.15 * i,
                  }}
                />
              ))}
            </div>
            <Pause className="w-4 h-4 text-accent-pink fill-accent-pink/20 relative z-10" />
          </div>
        ) : (
          <Play className="w-4 h-4 text-text-ink group-hover:text-accent-pink transition-colors fill-current pl-[1px]" />
        )}
      </motion.button>
    </div>
  );
};
