'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { memoriesConfig, SongItem } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface MusicContextType {
  currentSongIndex: number;
  currentSong: SongItem;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  selectSong: (index: number) => void;
  ambientChannel: 'off' | 'lofi' | 'rain' | 'crackle';
  setAmbientChannel: (channel: 'off' | 'lofi' | 'rain' | 'crackle') => void;
  volume: number;
  setVolume: (vol: number) => void;
  songs: SongItem[];
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const songs = memoriesConfig.songs;
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambientChannel, setAmbientChannelState] = useState<'off' | 'lofi' | 'rain' | 'crackle'>('off');
  const [volume, setVolumeState] = useState(0.55);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = songs[currentSongIndex] || songs[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(currentSong.url);
      audio.preload = 'auto';
      audio.volume = volume;
      audioRef.current = audio;

      const handleEnded = () => {
        nextSong();
      };
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  // Update audio source when song changes
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const wasPlaying = isPlaying;
    
    // Only update src if changed
    if (!audio.src.endsWith(currentSong.url)) {
      audio.src = currentSong.url;
      audio.load();
      if (wasPlaying) {
        audio.play().catch((err) => console.log('Audio autoplay prevented:', err));
      }
    }
  }, [currentSongIndex, currentSong.url]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((e) => console.log('Audio playback prevented:', e));
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    SoundEngine.playPopClick();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const selectSong = useCallback((index: number) => {
    SoundEngine.playPopClick();
    const targetIdx = (index + songs.length) % songs.length;
    setCurrentSongIndex(targetIdx);
    if (audioRef.current) {
      audioRef.current.src = songs[targetIdx].url;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Playback error:', e));
    }
  }, [songs]);

  const nextSong = useCallback(() => {
    selectSong(currentSongIndex + 1);
  }, [currentSongIndex, selectSong]);

  const prevSong = useCallback(() => {
    selectSong(currentSongIndex - 1);
  }, [currentSongIndex, selectSong]);

  const setAmbientChannel = useCallback((ch: 'off' | 'lofi' | 'rain' | 'crackle') => {
    SoundEngine.playPopClick();
    setAmbientChannelState(ch);
    SoundEngine.setChannel(ch);
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentSongIndex,
        currentSong,
        isPlaying,
        play,
        pause,
        togglePlay,
        nextSong,
        prevSong,
        selectSong,
        ambientChannel,
        setAmbientChannel,
        volume,
        setVolume,
        songs,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return ctx;
};
