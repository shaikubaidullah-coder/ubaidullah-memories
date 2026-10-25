'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, ListMusic, CloudRain, Flame, Music, Disc } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';
import { SoundEngine } from '@/utils/audio';

interface AudioPlayerProps {
  scene: string;
  autoPlayTrigger?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ scene = 'intro', autoPlayTrigger = false }) => {
  const {
    currentSong,
    currentSongIndex,
    isPlaying,
    togglePlay,
    play,
    nextSong,
    prevSong,
    selectSong,
    ambientChannel,
    setAmbientChannel,
    setVolume,
    songs,
  } = useMusic();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showAmbientMenu, setShowAmbientMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Auto-play trigger from intro scene
  useEffect(() => {
    if (autoPlayTrigger && !isPlaying) {
      play();
      setShowToast(false);
    }
  }, [autoPlayTrigger, isPlaying, play]);

  // Initial toast reminder
  useEffect(() => {
    const timer1 = setTimeout(() => setShowToast(true), 2500);
    const timer2 = setTimeout(() => setShowToast(false), 8000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Duck audio volume for reflective scenes
  useEffect(() => {
    if (['letter', 'sky'].includes(scene)) {
      setVolume(0.28);
    } else {
      setVolume(0.65);
    }
  }, [scene, setVolume]);

  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[99] pointer-events-auto flex items-center gap-2 md:gap-3">
      {/* Toast Prompt */}
      <AnimatePresence>
        {showToast && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-accent-pink/30 shadow-md text-[10px] font-sans font-bold text-accent-pink tracking-wider whitespace-nowrap select-none flex items-center gap-1.5"
          >
            <span>Play AUR Soundtrack 🎵</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Selector Dropdown Button */}
      <div className="relative">
        <button
          onClick={() => {
            SoundEngine.playPopClick();
            setShowPlaylist(!showPlaylist);
            if (showAmbientMenu) setShowAmbientMenu(false);
          }}
          className={`h-9 px-3 md:h-10 md:px-3.5 flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md border shadow-md hover:shadow-lg transition-all text-xs font-bold cursor-pointer ${
            showPlaylist ? 'border-accent-pink text-accent-pink' : 'border-text-ink/10 text-text-ink/80'
          }`}
          title="Select Song from Playlist"
        >
          <ListMusic className="w-3.5 h-3.5 text-accent-pink" />
          <span className="hidden sm:inline font-sans font-semibold text-[11px] truncate max-w-[110px]">
            {currentSong.title}
          </span>
          {isPlaying && (
            <div className="flex items-end gap-[2px] h-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-[2px] bg-accent-pink rounded-full"
                  animate={{ height: ['20%', '100%', '20%'] }}
                  transition={{
                    duration: 0.35 + 0.1 * i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.1 * i,
                  }}
                />
              ))}
            </div>
          )}
        </button>

        {/* Playlist Popup Menu */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 bg-white/95 backdrop-blur-md border border-text-ink/10 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-1 w-[260px] z-50 text-xs font-sans font-bold"
            >
              <div className="flex justify-between items-center px-2 py-1 text-[9px] uppercase tracking-wider text-text-ink/40 border-b border-zinc-100 pb-1 mb-1">
                <span>AUR Songs Playlist (4)</span>
                <span className="text-accent-pink">Official Audio</span>
              </div>
              {songs.map((song, idx) => {
                const isCurrent = idx === currentSongIndex;
                return (
                  <button
                    key={song.id}
                    onClick={() => {
                      selectSong(idx);
                      setShowPlaylist(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      isCurrent
                        ? 'bg-accent-pink/15 text-accent-pink border border-accent-pink/20'
                        : 'hover:bg-zinc-100 text-text-ink'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-bold text-xs truncate">{song.title}</span>
                      <span className="text-[10px] text-text-ink/60 truncate font-normal">{song.artist}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-text-ink/50">{song.duration}</span>
                      {isCurrent && isPlaying && (
                        <div className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
                      )}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient Sound Mode Switcher */}
      <div className="relative">
        <button
          onClick={() => {
            SoundEngine.playPopClick();
            setShowAmbientMenu(!showAmbientMenu);
            if (showPlaylist) setShowPlaylist(false);
          }}
          className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-md border shadow-md hover:shadow-lg transition-all text-xs font-bold cursor-pointer ${
            ambientChannel !== 'off' ? 'border-accent-pink text-accent-pink' : 'border-text-ink/10 text-text-ink/70'
          }`}
          title="Ambient Soundscape (Lofi, Rain, Vinyl)"
        >
          {ambientChannel === 'lofi' ? <Disc className="w-4 h-4 animate-spin text-accent-pink" /> :
           ambientChannel === 'rain' ? <CloudRain className="w-4 h-4 text-blue-500" /> :
           ambientChannel === 'crackle' ? <Flame className="w-4 h-4 text-amber-500" /> :
           <CloudRain className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showAmbientMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 bg-white/95 backdrop-blur-md border border-text-ink/10 rounded-2xl shadow-xl p-2 flex flex-col gap-1 min-w-[140px] z-50 text-xs font-sans font-bold"
            >
              <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-text-ink/40">Ambient Layer</div>
              <button
                onClick={() => {
                  setAmbientChannel('off');
                  setShowAmbientMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-colors ${
                  ambientChannel === 'off' ? 'bg-accent-pink/15 text-accent-pink' : 'hover:bg-zinc-100 text-text-ink'
                }`}
              >
                <span>Mute Ambient</span>
              </button>
              <button
                onClick={() => {
                  setAmbientChannel('lofi');
                  setShowAmbientMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-colors ${
                  ambientChannel === 'lofi' ? 'bg-accent-pink/15 text-accent-pink' : 'hover:bg-zinc-100 text-text-ink'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Lofi Synth</span>
              </button>
              <button
                onClick={() => {
                  setAmbientChannel('rain');
                  setShowAmbientMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-colors ${
                  ambientChannel === 'rain' ? 'bg-accent-pink/15 text-accent-pink' : 'hover:bg-zinc-100 text-text-ink'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Gentle Rain</span>
              </button>
              <button
                onClick={() => {
                  setAmbientChannel('crackle');
                  setShowAmbientMenu(false);
                }}
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

      {/* Prev / Next Track Skip Controls */}
      <div className="hidden sm:flex items-center gap-1 bg-white/90 backdrop-blur-md border border-text-ink/10 rounded-xl p-0.5 shadow-md">
        <button
          onClick={prevSong}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 active:scale-95 text-text-ink/70 hover:text-accent-pink transition-colors cursor-pointer"
          title="Previous Track"
        >
          <SkipBack className="w-3.5 h-3.5 fill-current" />
        </button>
        <button
          onClick={nextSong}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 active:scale-95 text-text-ink/70 hover:text-accent-pink transition-colors cursor-pointer"
          title="Next Track"
        >
          <SkipForward className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Main Play / Pause Button */}
      <motion.button
        onClick={togglePlay}
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
          <Pause className="w-4 h-4 text-accent-pink fill-accent-pink/20 relative z-10" />
        ) : (
          <Play className="w-4 h-4 text-text-ink group-hover:text-accent-pink transition-colors fill-current pl-[1px]" />
        )}
      </motion.button>
    </div>
  );
};
