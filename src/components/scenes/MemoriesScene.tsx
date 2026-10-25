'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { PolaroidCard } from '../PolaroidCard';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface MemoriesSceneProps {
  onContinue: () => void;
  onReplay: () => void;
}

export const MemoriesScene: React.FC<MemoriesSceneProps> = ({ onContinue, onReplay }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isNoteRevealed, setIsNoteRevealed] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  const [showSpecialNote, setShowSpecialNote] = useState(false);
  const [showLittleThings, setShowLittleThings] = useState(false);
  const [isCameraFlashing, setIsCameraFlashing] = useState(false);
  const [capturedSnaps, setCapturedSnaps] = useState<string[]>([]);
  const [albumIndex, setAlbumIndex] = useState(0);

  const [polaroidPos, setPolaroidPos] = useState({ x: 0, y: 0 });

  const { desk } = memoriesConfig;
  const { polaroids, hiddenNoteText, album, specialNote, littleThings } = desk;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCaptureSnapshot = async () => {
    SoundEngine.playPopClick();
    setIsCameraFlashing(true);
    setTimeout(() => setIsCameraFlashing(false), 200);

    try {
      const canvas = await html2canvas(document.body, {
        ignoreElements: (el) => el.hasAttribute('data-html2canvas-ignore'),
        useCORS: true,
        scale: 1,
      });
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedSnaps((prev) => [...prev, dataUrl]);
      SoundEngine.playPaperRustle();
    } catch (e) {
      console.log('Snapshot failed:', e);
    }
  };

  const handleProceed = () => {
    SoundEngine.playPaperRustle();
    onContinue();
  };

  return (
    <div className="relative w-full min-h-screen bg-paper overflow-hidden flex flex-col justify-start items-center py-6 px-4 md:py-8 md:px-8 select-none">
      {/* White camera flash overlay */}
      <AnimatePresence>
        {isCameraFlashing && (
          <motion.div
            className="fixed inset-0 bg-white z-[99] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Ambient Radial Desk Lighting */}
      <div
        className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-20"
        style={{
          background: 'radial-gradient(circle at 65% 35%, #F7E5A9 0%, transparent 60%)',
          animation: 'deskLightDrift 20s ease-in-out infinite alternate',
        }}
      />
      <style jsx global>{`
        @keyframes deskLightDrift {
          0% {
            filter: saturate(1);
          }
          100% {
            filter: saturate(1.2) hue-rotate(10deg);
          }
        }
      `}</style>

      {/* Header */}
      <div className="w-full max-w-lg text-center mt-2 z-30 pointer-events-none">
        <h1 className="font-handwritten text-3xl md:text-5xl font-black tracking-tight text-text-ink/90">
          {desk.title}
        </h1>
        <p className="font-sans text-[11px] md:text-xs font-bold uppercase tracking-wider text-text-ink/60 mt-1.5">
          {desk.subtitle}
        </p>
      </div>

      {/* Main Interactive Desktop Area */}
      <div className="flex-grow w-full max-w-6xl mx-auto relative flex flex-col md:block items-center justify-center my-6 z-20 min-h-[500px]">
        {/* Secret Note revealed underneath dragged polaroid */}
        {isNoteRevealed && (
          <motion.div
            className="relative md:absolute md:left-[calc(50%-440px)] md:top-[calc(50%+40px)] bg-[#FEF9E7] border border-[#E9DFB9] shadow-xs p-3.5 w-[140px] rotate-[-5deg] pointer-events-auto z-10 mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            transition={{ type: 'spring', stiffness: 180 }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-4 bg-accent-yellow/40 border border-accent-yellow/10 rotate-2" />
            <p className="font-handwritten text-xs text-text-ink/80 leading-normal">
              {hiddenNoteText}
            </p>
          </motion.div>
        )}

        {/* Polaroid 1 (Draggable to uncover secret note!) */}
        {polaroids[0] && (
          <motion.div
            className="relative md:absolute w-[200px] md:w-[170px] pointer-events-auto cursor-grab active:cursor-grabbing z-25 mx-auto"
            style={{
              left: isMobile ? undefined : 'calc(50% - 460px)',
              top: isMobile ? undefined : 'calc(50% - 240px)',
            }}
            drag
            dragMomentum={false}
            dragConstraints={{ left: -120, right: 120, top: -120, bottom: 120 }}
            animate={{ x: polaroidPos.x, y: polaroidPos.y }}
            onDragEnd={(_, info) => {
              const nx = polaroidPos.x + info.offset.x;
              const ny = polaroidPos.y + info.offset.y;
              if (Math.abs(nx) > 40 || Math.abs(ny) > 40) {
                setIsNoteRevealed(true);
                SoundEngine.playPopClick();
              }
              setPolaroidPos({ x: nx, y: ny });
            }}
          >
            <PolaroidCard
              src={polaroids[0].src}
              caption={polaroids[0].caption}
              date={polaroids[0].date}
              rotation={-6}
              tapeColor="yellow"
              tapePosition="top-center"
            />
          </motion.div>
        )}

        {/* Polaroid 2 (Draggable) */}
        {!isMobile && polaroids[1] && (
          <motion.div
            className="absolute w-[170px] pointer-events-auto cursor-grab active:cursor-grabbing z-25"
            style={{ left: 'calc(50% - 460px)', top: 'calc(50% + 80px)' }}
            drag
            dragMomentum={false}
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
          >
            <PolaroidCard
              src={polaroids[1].src}
              caption={polaroids[1].caption}
              date={polaroids[1].date}
              rotation={-4}
              tapeColor="blue"
              tapePosition="top-left"
            />
          </motion.div>
        )}

        {/* Polaroid 3 (Draggable) */}
        {!isMobile && polaroids[2] && (
          <motion.div
            className="absolute w-[170px] pointer-events-auto cursor-grab active:cursor-grabbing z-25"
            style={{ left: 'calc(50% + 310px)', top: 'calc(50% - 240px)' }}
            drag
            dragMomentum={false}
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
          >
            <PolaroidCard
              src={polaroids[2].src}
              caption={polaroids[2].caption}
              date={polaroids[2].date}
              rotation={5}
              tapeColor="pink"
              tapePosition="top-right"
            />
          </motion.div>
        )}

        {/* Interactive "Our Album" Book Drawer */}
        <motion.div
          className="relative md:absolute md:left-[calc(50%+300px)] md:top-[calc(50%+90px)] w-[200px] md:w-[180px] h-[130px] bg-[#FAF8F5] border-l-[8px] border-l-[#A68F81] border border-[#DFD8C4] shadow-sm rounded-xs flex flex-col justify-end p-4 rotate-[4deg] cursor-pointer pointer-events-auto z-20 mx-auto mt-4 md:mt-0"
          whileHover={{ scale: 1.04, rotate: 2 }}
          onClick={() => {
            SoundEngine.playPaperRustle();
            setShowAlbum(true);
          }}
        >
          <div className="w-4 h-4 bg-[#CBB5A6] rounded-full self-end mb-2" />
          <div>
            <h2 className="font-handwritten text-xl text-text-ink/90 font-bold leading-none">{album.title}</h2>
            <span className="text-[7px] font-sans font-bold uppercase tracking-widest text-[#BFA28F] mt-1.5 block">
              Click to Browse ({album.photos.length} photos) →
            </span>
          </div>
        </motion.div>

        {/* Interactive "for you... ♡" Note */}
        <motion.div
          className="relative md:absolute md:left-[calc(50%-240px)] md:top-[calc(50%+90px)] w-[200px] md:w-[180px] h-[120px] bg-[#F7F2E7] border border-[#DFD6BF] shadow-xs rounded-xs cursor-pointer pointer-events-auto z-20 mx-auto mt-4 md:mt-0"
          whileHover={{ scale: 1.04 }}
          onClick={() => {
            SoundEngine.playPopClick();
            setShowSpecialNote(true);
          }}
        >
          <div className="absolute top-1.5 left-4 w-7 h-4 bg-accent-yellow/20 rotate-[-15deg] border border-dashed border-accent-yellow/10" />
          <div className="text-center pt-8">
            <span className="font-handwritten text-lg text-text-ink/80 block">{specialNote.title}</span>
            <span className="text-[7px] font-sans font-bold tracking-widest text-[#BFA28F] uppercase mt-2 block">
              Click to open
            </span>
          </div>
        </motion.div>

        {/* Interactive "little things" Note */}
        <motion.div
          className="relative md:absolute md:left-[calc(50%+100px)] md:top-[calc(50%+80px)] w-[200px] md:w-[180px] h-[130px] bg-[#F5ECE1] border-2 border-[#D5CBB9] shadow-sm rounded-sm p-4 rotate-[-8deg] cursor-pointer pointer-events-auto z-20 mx-auto mt-4 md:mt-0"
          whileHover={{ scale: 1.04 }}
          onClick={() => {
            SoundEngine.playPopClick();
            setShowLittleThings(true);
          }}
        >
          <div className="border border-[#E2D8C6] border-dashed p-2 rounded-xs text-center w-full h-full flex flex-col justify-center">
            <span className="font-handwritten text-xl text-[#8E8171] font-bold">{littleThings.title}</span>
            <span className="text-[7px] font-sans font-bold uppercase tracking-wider text-[#AFA292] mt-1.5 block">
              Click to open
            </span>
          </div>
        </motion.div>

        {/* Working "lofi-cam" Vintage Camera on Desk! */}
        <motion.div
          data-html2canvas-ignore="true"
          className="hidden md:flex md:absolute md:left-[calc(50%-70px)] md:top-[calc(50%+130px)] w-[120px] h-[75px] bg-[#E6DEC9] border border-[#C7B79D] shadow-md rounded-sm cursor-pointer pointer-events-auto items-center justify-center group z-20 rotate-[3deg]"
          whileHover={{ scale: 1.08, y: -4, rotate: 0 }}
          onClick={handleCaptureSnapshot}
          title="Click to take instant photo snapshot of your screen!"
        >
          <div className="absolute -top-1.5 right-4 w-4 h-1.5 bg-[#B5A591] rounded-t-xs" />
          <div className="w-10 h-10 rounded-full bg-[#1A1816] border-[4px] border-[#5C544C] flex items-center justify-center relative overflow-hidden">
            <div className="w-3 h-3 rounded-full bg-cyan-400/50 absolute top-1.5 left-1.5 blur-xs group-hover:scale-125 transition-transform" />
          </div>
          <div className="absolute bottom-1.5 text-[7px] font-sans font-bold text-text-ink/65 uppercase tracking-widest">
            lofi-cam 📷
          </div>
        </motion.div>

        {/* Newly printed instant snapshots from lofi-cam */}
        {capturedSnaps.map((snapUrl, idx) => (
          <motion.div
            key={idx}
            className="absolute w-[150px] pointer-events-auto cursor-grab active:cursor-grabbing z-40 bg-white p-2 pb-4 shadow-xl border border-zinc-200"
            style={{
              left: `calc(50% - 70px + ${idx * 20}px)`,
              top: `calc(50% + 40px - ${idx * 25}px)`,
              rotate: (idx % 2 === 0 ? 8 : -8),
            }}
            drag
            dragMomentum={false}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={snapUrl} alt="Snapshot" className="w-full aspect-[4/3] object-cover border border-zinc-100" />
            <div className="font-handwritten text-[10px] text-center text-text-ink/80 mt-1.5 font-bold">
              snap #{idx + 1} ✨
            </div>
          </motion.div>
        ))}
      </div>

      {/* Album Photo Book Modal */}
      <AnimatePresence>
        {showAlbum && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAlbum(false)}
          >
            <motion.div
              className="bg-[#FCFAF5] border border-[#DFD6BE] rounded-xl max-w-lg w-full p-6 shadow-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 border-b border-zinc-200 pb-2">
                <h3 className="font-handwritten text-2xl font-bold text-accent-pink">{album.title}</h3>
                <span className="font-sans text-xs text-text-ink/50 font-bold uppercase tracking-wider">
                  {albumIndex + 1} / {album.photos.length}
                </span>
              </div>

              {album.photos[albumIndex] && (
                <div className="flex flex-col items-center">
                  <div className="relative aspect-square w-full max-w-[300px] bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200/80 mb-4 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={album.photos[albumIndex].src}
                      alt={album.photos[albumIndex].caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-handwritten text-lg font-bold text-text-ink text-center">
                    {album.photos[albumIndex].caption}
                  </p>
                  <p className="font-sans text-xs uppercase tracking-widest text-text-ink/40 mt-1">
                    {album.photos[albumIndex].date}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-200">
                <button
                  onClick={() => {
                    SoundEngine.playPaperRustle();
                    setAlbumIndex((prev) => (prev > 0 ? prev - 1 : album.photos.length - 1));
                  }}
                  className="px-4 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-bold font-sans cursor-pointer"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setShowAlbum(false)}
                  className="px-4 py-1.5 rounded-full bg-accent-pink text-white text-xs font-bold font-sans cursor-pointer"
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    SoundEngine.playPaperRustle();
                    setAlbumIndex((prev) => (prev < album.photos.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-4 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-bold font-sans cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special Note Modal */}
      <AnimatePresence>
        {showSpecialNote && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSpecialNote(false)}
          >
            <motion.div
              className="bg-[#FFFDF9] border border-[#E9DFB9] rounded-xl max-w-sm w-full p-8 shadow-2xl relative text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-handwritten text-2xl font-bold text-accent-pink mb-4">{specialNote.title}</h3>
              <p className="font-handwritten text-lg text-text-ink/85 leading-relaxed mb-6">{specialNote.message}</p>
              <p className="font-handwritten text-sm text-text-ink/60 font-bold italic">{specialNote.signOff}</p>
              <button
                onClick={() => setShowSpecialNote(false)}
                className="mt-6 px-6 py-2 rounded-full bg-accent-pink text-white text-xs font-bold font-sans cursor-pointer"
              >
                Close ♡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Little Things Modal */}
      <AnimatePresence>
        {showLittleThings && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLittleThings(false)}
          >
            <motion.div
              className="bg-[#FCFAF5] border border-[#DFD6BE] rounded-xl max-w-md w-full p-6 shadow-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-handwritten text-2xl font-bold text-[#8E8171] mb-4 text-center">
                {littleThings.title} ☕
              </h3>
              <ul className="space-y-3 font-handwritten text-base text-text-ink/80 pl-2">
                {littleThings.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent-pink">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowLittleThings(false)}
                className="mt-6 mx-auto block px-6 py-2 rounded-full bg-zinc-800 text-white text-xs font-bold font-sans cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Button to Advance to Mixtape Vault */}
      <div className="w-full flex justify-center z-30 pb-4">
        <motion.button
          onClick={handleProceed}
          className="px-8 py-3 bg-[#FFFDF9] text-text-ink hand-drawn-border font-handwritten text-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all hover:text-accent-pink flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>the mixtape vault 📼 →</span>
        </motion.button>
      </div>
    </div>
  );
};
