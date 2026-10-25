'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';
import { WashiTape } from '../WashiTape';
import { Doodle } from '../Doodles';

interface JourneySceneProps {
  onContinue: () => void;
  onBack: () => void;
}

export const JourneyScene: React.FC<JourneySceneProps> = ({ onContinue, onBack }) => {
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState(0);

  const { journey } = memoriesConfig;
  const milestones = journey.milestones;
  const activeMilestone = milestones[selectedMilestoneIdx];

  const handleSelect = (idx: number) => {
    SoundEngine.playPaperRustle();
    setSelectedMilestoneIdx(idx);
  };

  return (
    <div className="relative w-full min-h-screen bg-paper overflow-hidden flex flex-col justify-between items-center py-6 px-4 md:py-10 md:px-8 select-none">
      {/* Background Soft Drift */}
      <div
        className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-25"
        style={{
          background: 'radial-gradient(circle at 70% 30%, #7EAFCE 0%, #FAF1E7 60%, transparent 80%)',
        }}
      />

      {/* Header */}
      <div className="w-full max-w-lg text-center mt-2 z-20 pointer-events-none">
        <span className="font-handwritten text-lg text-accent-pink tracking-wider font-extrabold uppercase select-none block mb-1">
          our roadmap
        </span>
        <h1 className="font-handwritten text-3xl md:text-5xl font-black tracking-tight text-text-ink/90">
          {journey.title}
        </h1>
        <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-wider text-text-ink/60 mt-1">
          {journey.subtitle}
        </p>
      </div>

      {/* Timeline Milestone Navigation Bar */}
      <div className="w-full max-w-4xl mx-auto z-20 my-4">
        {/* Horizontal Progress Path */}
        <div className="relative flex items-center justify-between px-4 md:px-8">
          {/* Connecting Dotted Line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-text-ink/25 z-0" />

          {milestones.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => handleSelect(idx)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center font-handwritten text-base md:text-lg font-bold shadow-md transition-all ${
                  selectedMilestoneIdx === idx
                    ? 'bg-accent-pink text-white border-white scale-115 ring-4 ring-accent-pink/20'
                    : 'bg-white text-text-ink/70 border-text-ink/15 hover:scale-105'
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`mt-2 font-handwritten text-xs md:text-sm font-bold whitespace-nowrap hidden sm:block ${
                  selectedMilestoneIdx === idx ? 'text-accent-pink' : 'text-text-ink/50'
                }`}
              >
                {m.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Milestone Card Detail */}
      <div className="w-full max-w-3xl mx-auto flex-grow flex items-center justify-center my-4 z-20">
        <AnimatePresence mode="wait">
          {activeMilestone && (
            <motion.div
              key={activeMilestone.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-[#FFFDF9] border border-[#DFD8C4] rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative"
            >
              <WashiTape color="yellow" className="-top-3 left-6 w-24 h-6" tilt={-2} />
              <WashiTape color="pink" className="-top-3 right-6 w-24 h-6" tilt={3} />

              {/* Photo Frame */}
              <div className="w-[200px] md:w-[240px] aspect-[1/1.2] flex-shrink-0 bg-white p-2.5 pb-5 border border-zinc-200/80 shadow-md rounded-xs rotate-[-2deg]">
                <div className="w-full aspect-square bg-zinc-100 overflow-hidden rounded-xs border border-zinc-200/50 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeMilestone.image}
                    alt={activeMilestone.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-sans text-[9px] uppercase tracking-widest text-text-ink/40 text-center font-bold">
                  {activeMilestone.date}
                </div>
              </div>

              {/* Story & Description */}
              <div className="flex flex-col justify-between flex-grow text-left">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold bg-accent-pink/15 text-accent-pink px-2.5 py-0.5 rounded-full uppercase">
                      {activeMilestone.tag}
                    </span>
                    <span className="text-xs font-mono text-text-ink/40 font-bold">{activeMilestone.date}</span>
                  </div>
                  <h3 className="font-handwritten text-2xl md:text-3xl font-black text-text-ink/90 mt-1 mb-2">
                    {activeMilestone.title}
                  </h3>
                  <p className="font-sans text-sm md:text-base text-text-ink/75 leading-relaxed">
                    {activeMilestone.description}
                  </p>
                </div>

                {activeMilestone.quote && (
                  <div className="mt-4 pt-3 border-t border-dashed border-zinc-200">
                    <p className="font-handwritten text-base md:text-lg text-accent-pink font-bold italic">
                      &ldquo;{activeMilestone.quote}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="w-full flex items-center justify-center gap-6 z-30 pb-4">
        <button
          onClick={onBack}
          className="text-xs font-sans font-bold tracking-wider text-text-ink/50 hover:text-text-ink uppercase transition-colors cursor-pointer"
        >
          [ ← Back to Mixtape ]
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
          <span>read the letter →</span>
        </motion.button>
      </div>
    </div>
  );
};
