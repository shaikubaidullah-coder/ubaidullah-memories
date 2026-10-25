'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCw, Volume2, Music, Sparkles } from 'lucide-react';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';
import { useMusic } from '@/context/MusicContext';
import { WashiTape } from '../WashiTape';
import { Doodle } from '../Doodles';

interface MixtapeSceneProps {
  onContinue: () => void;
  onBack: () => void;
}

export const MixtapeScene: React.FC<MixtapeSceneProps> = ({ onContinue, onBack }) => {
  const {
    currentSong,
    currentSongIndex,
    isPlaying,
    togglePlay,
    selectSong,
    nextSong,
    prevSong,
    songs,
  } = useMusic();

  const [isFlipped, setIsFlipped] = useState(false);
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  const { mixtape } = memoriesConfig;

  const handleFlipTape = () => {
    SoundEngine.playPaperRustle();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full min-h-screen bg-paper overflow-hidden flex flex-col justify-between items-center py-6 px-4 md:py-10 md:px-8 select-none">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #F2CA65 0%, #FAF1E7 60%, transparent 80%)',
        }}
      />

      {/* Header */}
      <div className="w-full max-w-lg text-center mt-2 z-20 pointer-events-none">
        <span className="font-handwritten text-lg text-accent-pink tracking-wider font-extrabold uppercase select-none block mb-1">
          retro cassette vault
        </span>
        <h1 className="font-handwritten text-3xl md:text-5xl font-black tracking-tight text-text-ink/90">
          {mixtape.title}
        </h1>
        <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-wider text-text-ink/60 mt-1">
          {mixtape.subtitle}
        </p>
      </div>

      {/* Main Interactive Cassette Deck & Tracklist */}
      <div className="flex-grow w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 my-6 z-20">
        {/* Retro 3D Flippable Cassette Tape */}
        <div className="relative perspective-1000">
          <motion.div
            className="relative w-[320px] md:w-[380px] aspect-[1.6/1] cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            onClick={handleFlipTape}
            title="Click to flip cassette tape!"
          >
            {/* FRONT SIDE (SIDE A) */}
            <div
              className="absolute inset-0 bg-[#252220] rounded-2xl border-4 border-[#3D3734] shadow-2xl p-4 flex flex-col justify-between backface-hidden"
            >
              {/* Top Screw Holes */}
              <div className="flex justify-between items-center px-2">
                <div className="w-3 h-3 rounded-full bg-[#181615] border border-zinc-700" />
                <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">
                  TYPE I • HI-FI AUDIO
                </div>
                <div className="w-3 h-3 rounded-full bg-[#181615] border border-zinc-700" />
              </div>

              {/* Tape Label Paper */}
              <div className="bg-[#FAF7F0] rounded-lg p-2.5 border border-[#DFD8C4] flex flex-col justify-between shadow-inner">
                <div className="flex justify-between items-center border-b border-zinc-300 pb-1">
                  <span className="font-handwritten text-sm md:text-base font-bold text-accent-pink">
                    {mixtape.cassetteLabel}
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-accent-pink/15 text-accent-pink px-2 py-0.5 rounded-full">
                    SIDE A
                  </span>
                </div>

                {/* Center Tape Window with Spools */}
                <div className="my-2 bg-[#1A1817] rounded-md border border-zinc-600 p-2 flex items-center justify-between px-8 relative overflow-hidden">
                  {/* Left Spool */}
                  <div className="relative w-12 h-12 rounded-full border-2 border-zinc-500 bg-[#2C2725] flex items-center justify-center">
                    <motion.div
                      className="w-8 h-8 rounded-full border border-dashed border-zinc-400 flex items-center justify-center"
                      animate={isPlaying ? { rotate: 360 } : {}}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-3 h-3 rounded-full bg-zinc-800" />
                    </motion.div>
                  </div>

                  {/* Tape level center window */}
                  <div className="h-6 w-24 bg-zinc-800/80 rounded border border-zinc-600 flex items-center justify-center px-2">
                    <span className="text-[8px] font-mono text-zinc-300 tracking-wider truncate">
                      {isPlaying ? `PLAYING: ${currentSong.title.toUpperCase()}` : 'STOPPED'}
                    </span>
                  </div>

                  {/* Right Spool */}
                  <div className="relative w-12 h-12 rounded-full border-2 border-zinc-500 bg-[#2C2725] flex items-center justify-center">
                    <motion.div
                      className="w-8 h-8 rounded-full border border-dashed border-zinc-400 flex items-center justify-center"
                      animate={isPlaying ? { rotate: 360 } : {}}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-3 h-3 rounded-full bg-zinc-800" />
                    </motion.div>
                  </div>
                </div>

                {/* Handwritten Current Track Name */}
                <div className="flex justify-between items-center pt-0.5">
                  <div className="min-w-0 pr-2">
                    <span className="font-handwritten text-xs text-text-ink/90 font-bold block truncate max-w-[200px]">
                      {currentSong.title}
                    </span>
                    <span className="text-[9px] font-sans text-text-ink/60 block truncate">
                      {currentSong.artist}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-text-ink/50 font-bold shrink-0">{currentSong.duration}</span>
                </div>
              </div>

              {/* Bottom Tape Opening Notch */}
              <div className="flex justify-center items-center">
                <div className="w-24 h-3 bg-[#181615] rounded-t-sm border-t border-zinc-700 flex justify-center items-center">
                  <div className="w-8 h-1 bg-amber-800/40 rounded-full" />
                </div>
              </div>
            </div>

            {/* BACK SIDE (SIDE B) */}
            <div
              className="absolute inset-0 bg-[#252220] rounded-2xl border-4 border-[#3D3734] shadow-2xl p-4 flex flex-col justify-between backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="flex justify-between items-center px-2">
                <div className="w-3 h-3 rounded-full bg-[#181615] border border-zinc-700" />
                <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">
                  MEMORIES ARCHIVE • 2026
                </div>
                <div className="w-3 h-3 rounded-full bg-[#181615] border border-zinc-700" />
              </div>

              <div className="bg-[#FAF7F0] rounded-lg p-3 border border-[#DFD8C4] flex flex-col justify-between h-[80%] shadow-inner text-center">
                <span className="text-[9px] font-mono font-bold bg-accent-yellow/20 text-text-ink px-2 py-0.5 rounded-full self-center">
                  SIDE B — PERSONAL VAULT
                </span>
                <p className="font-handwritten text-base text-accent-pink font-bold my-auto leading-relaxed px-2">
                  &ldquo;{mixtape.quotes[activeQuoteIdx]}&rdquo;
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    SoundEngine.playPopClick();
                    setActiveQuoteIdx((prev) => (prev + 1) % mixtape.quotes.length);
                  }}
                  className="text-[9px] font-sans font-bold text-text-ink/50 hover:text-text-ink uppercase tracking-wider cursor-pointer"
                >
                  [ Next Quote ✨ ]
                </button>
              </div>

              <div className="flex justify-center">
                <span className="text-[9px] font-mono text-zinc-500">CLICK TO FLIP BACK TO SIDE A</span>
              </div>
            </div>
          </motion.div>

          <span className="block text-center font-handwritten text-xs text-text-ink/50 mt-3 select-none">
            [ click cassette to flip Side A / B 🔄 ]
          </span>
        </div>

        {/* Tracklist & Controls Card */}
        <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm border border-[#DFD8C4] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3 border-b border-zinc-100 pb-2">
            <span className="font-handwritten text-lg font-bold text-text-ink">AUR Playlist</span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-accent-pink">
              Official MP3 Tracks
            </span>
          </div>

          {/* Tracks list */}
          <div className="space-y-2 mb-4">
            {songs.map((song, idx) => (
              <button
                key={song.id}
                onClick={() => selectSong(idx)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  currentSongIndex === idx
                    ? 'bg-accent-pink/15 border border-accent-pink/40 shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      currentSongIndex === idx ? 'bg-accent-pink text-white' : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans text-xs font-bold text-text-ink leading-tight truncate">{song.title}</div>
                    <div className="text-[9px] text-text-ink/50 font-sans truncate">{song.artist}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono font-bold text-text-ink/60">{song.duration}</span>
                  <div className="text-[8px] font-sans font-bold text-accent-pink uppercase">{song.mood}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Player Playback Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
            <div className="flex items-center gap-2">
              <button
                onClick={prevSong}
                className="w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-700 cursor-pointer active:scale-95"
                title="Previous Track"
              >
                <SkipBack className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className={`px-5 py-2 rounded-full font-sans text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isPlaying ? 'bg-accent-pink text-white hover:bg-accent-pink/90' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Track'}</span>
              </button>
              <button
                onClick={nextSong}
                className="w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-700 cursor-pointer active:scale-95"
                title="Next Track"
              >
                <SkipForward className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-text-ink/60">
              <Volume2 className="w-4 h-4 text-accent-pink" />
              <span className="text-[10px] font-mono font-bold uppercase">{currentSong.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex items-center justify-center gap-6 z-30 pb-4">
        <button
          onClick={onBack}
          className="text-xs font-sans font-bold tracking-wider text-text-ink/50 hover:text-text-ink uppercase transition-colors cursor-pointer"
        >
          [ ← Back to Memories ]
        </button>
        <motion.button
          onClick={() => {
            SoundEngine.playPaperRustle();
            onContinue();
          }}
          className="px-8 py-3 bg-[#FFFDF9] text-text-ink hand-drawn-border font-handwritten text-lg md:text-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all hover:text-accent-pink flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>explore my milestones →</span>
        </motion.button>
      </div>
    </div>
  );
};
