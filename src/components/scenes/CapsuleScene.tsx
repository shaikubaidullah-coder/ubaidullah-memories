'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ToyRobot3D } from '../3d/ToyRobot3D';
import { Dollar3D } from '../3d/Dollar3D';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface CapsuleSceneProps {
  onContinue: () => void;
  onBackToLetter: () => void;
  onReplay: () => void;
}

export const CapsuleScene: React.FC<CapsuleSceneProps> = ({
  onContinue,
  onBackToLetter,
  onReplay,
}) => {
  const [jarState, setJarState] = useState<'closed' | 'opening' | 'open'>('closed');
  const [activeModal, setActiveModal] = useState<'memory' | 'question' | 'challenge' | 'secret' | 'freedom' | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerSaved, setIsAnswerSaved] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const { capsule } = memoriesConfig;

  useEffect(() => {
    const saved = localStorage.getItem('memoryCapsuleAnswer');
    if (saved) {
      setUserAnswer(saved);
      setIsAnswerSaved(true);
    }
  }, []);

  const handleJarClick = () => {
    if (jarState !== 'closed') return;
    SoundEngine.playPopClick();
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setJarState('opening');
      SoundEngine.playJarPop();
    }, 450);
    setTimeout(() => {
      setJarState('open');
      SoundEngine.playSparkle();
    }, 1200);
  };

  const handleSaveAnswer = () => {
    SoundEngine.playPopClick();
    localStorage.setItem('memoryCapsuleAnswer', userAnswer);
    setIsAnswerSaved(true);
    setActiveModal(null);
  };

  const handleProceed = () => {
    SoundEngine.playSparkle();
    setIsExiting(true);
    setTimeout(() => {
      onContinue();
    }, 1000);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0A0D14] flex flex-col justify-between items-center overflow-y-auto md:overflow-hidden py-6 pb-12 md:pb-8 px-4 select-none z-10 text-zinc-100">
      {/* Background Starry Night Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #151D2F 0%, #080B11 100%)',
        }}
      />
      <div
        className="fixed inset-0 opacity-15 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <div className="w-full text-center mt-8 md:mt-2 px-6 md:px-0 z-20 pointer-events-none">
        <span className="font-handwritten text-lg text-accent-pink tracking-wider font-extrabold uppercase select-none block mb-1">
          one more thing...
        </span>
        <h1 className="font-sans text-3xl md:text-5xl font-black tracking-tight leading-none text-zinc-100">
          {capsule.title}
        </h1>
        <p className="font-handwritten text-base md:text-lg font-bold italic mt-1.5 text-zinc-400">
          {capsule.subtitle}
        </p>
      </div>

      {/* Main Glass Jar Container */}
      <div className="flex-grow w-full flex flex-col md:flex-row items-center justify-center relative select-none z-20 my-6">
        {/* 3D Builder Robot Mascot on left side of jar */}
        <div className="hidden lg:flex flex-col items-center justify-center mr-8 w-[160px] h-[200px] bg-white/5 border border-white/10 rounded-2xl p-2 relative backdrop-blur-xs">
          <div className="text-[8px] font-mono text-cyan-400 text-center uppercase tracking-widest pb-1 border-b border-white/10 w-full">
            Vault Guardian 🤖
          </div>
          <div className="w-full h-[calc(100%-16px)] relative">
            <Canvas
              shadows
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
              camera={{ position: [0, 0.4, 2.4], fov: 42 }}
            >
              <ambientLight intensity={1.2} />
              <directionalLight position={[2, 4, 3]} intensity={1.5} />
              <Suspense fallback={null}>
                <ToyRobot3D position={[0, -0.2, 0]} scale={7.2} interactive={true} />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* The Glass Jar SVG & Cork */}
        <motion.div
          className={`relative pointer-events-auto cursor-pointer aspect-[0.7/1] flex flex-col items-center justify-end pb-4 transition-all duration-300 ${
            jarState === 'open' ? 'w-[160px] md:w-[190px]' : 'w-[200px] md:w-[230px]'
          } ${isShaking ? 'animate-shake' : ''}`}
          onClick={jarState === 'closed' ? handleJarClick : undefined}
          whileHover={jarState === 'closed' ? { scale: 1.04 } : {}}
        >
          {/* Jar SVG */}
          <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-2xl z-10 pointer-events-none">
            <path
              d="M15,35 C15,35 15,30 20,30 L80,30 C85,30 85,35 85,35 L85,120 C85,130 75,135 50,135 C25,135 15,130 15,120 Z"
              fill="rgba(255, 255, 255, 0.12)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.5"
            />
            <path
              d="M18,35 L82,35 L82,118 C82,126 73,131 50,131 C27,131 18,126 18,118 Z"
              fill="rgba(255, 255, 255, 0.05)"
            />
            {isAnswerSaved && (
              <g transform="translate(30, 75) rotate(-5)">
                <rect width="40" height="15" fill="#FAF6EB" stroke="#DFD8C4" strokeWidth="1" rx="2" />
                <text x="20" y="10.5" fill="#EFA2B1" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  saved. ♡
                </text>
              </g>
            )}
            <rect x="30" y="20" width="40" height="10" fill="rgba(255, 255, 255, 0.18)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" rx="2" />
            <path d="M22,40 C22,40 25,60 25,80" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2" strokeLinecap="round" />
            <path d="M78,45 C78,45 75,70 75,95" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeLinecap="round" />
          </svg>

          {/* Cork Lid */}
          <motion.div
            className="absolute top-[8%] z-20 w-[42%] aspect-[3/1] bg-[#C59B7E] rounded-xs border-b border-[#A0785C] shadow-inner"
            style={{ transformOrigin: 'bottom center' }}
            animate={
              jarState === 'opening'
                ? { y: -50, opacity: [1, 1, 0], rotate: 15 }
                : jarState === 'open'
                ? { y: -100, opacity: 0 }
                : { y: 0, opacity: 1 }
            }
            transition={{ duration: 0.9 }}
          />

          {/* Floating firefly particles rising when open */}
          {jarState === 'open' && (
            <div className="absolute top-[10%] inset-x-0 h-44 pointer-events-none z-10">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: `${4 + (i % 3) * 3}px`,
                    height: `${4 + (i % 3) * 3}px`,
                    backgroundColor: i % 2 === 0 ? '#FCD5B5' : '#F3A3B4',
                    boxShadow: '0 0 10px #FCD5B5',
                    bottom: '0%',
                  }}
                  animate={{
                    y: [0, -140 - (i % 4) * 25],
                    x: [0, (i % 2 === 0 ? 35 : -35) * Math.sin(i)],
                    opacity: [0, 0.9, 0],
                    scale: [0.3, 1.2, 0.2],
                  }}
                  transition={{
                    duration: 2.8 + (i % 3) * 0.5,
                    repeat: Infinity,
                    delay: 0.3 * i,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}

          {/* Prompt below jar */}
          {jarState === 'closed' && (
            <span className="absolute bottom-[-2rem] font-handwritten text-sm text-zinc-400 select-none animate-pulse">
              [ Click to open jar ]
            </span>
          )}
        </motion.div>

        {/* 4 Interactive Capsule Tokens (Revealed when open) */}
        {jarState === 'open' && !activeModal && (
          <motion.div
            className="grid grid-cols-2 gap-4 px-4 mt-6 md:mt-0 md:ml-12 pointer-events-auto z-30 select-none max-w-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Token 1: Memory */}
            <motion.button
              onClick={() => {
                SoundEngine.playPaperRustle();
                setActiveModal('memory');
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1F2937]/90 border border-zinc-700 p-4 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer group"
            >
              <span className="text-2xl mb-1 group-hover:scale-115 transition-transform">🌸</span>
              <span className="font-handwritten text-base font-bold text-accent-pink">Memory</span>
              <span className="text-[9px] font-sans text-zinc-400 mt-1 uppercase tracking-wider">A Photo</span>
            </motion.button>

            {/* Token 2: Question */}
            <motion.button
              onClick={() => {
                SoundEngine.playPopClick();
                setActiveModal('question');
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1F2937]/90 border border-zinc-700 p-4 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer group"
            >
              <span className="text-2xl mb-1 group-hover:scale-115 transition-transform">💭</span>
              <span className="font-handwritten text-base font-bold text-accent-yellow">A Question</span>
              <span className="text-[9px] font-sans text-zinc-400 mt-1 uppercase tracking-wider">
                {isAnswerSaved ? 'Answered ✓' : 'Write Answer'}
              </span>
            </motion.button>

            {/* Token 3: Dare */}
            <motion.button
              onClick={() => {
                SoundEngine.playPopClick();
                setActiveModal('challenge');
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1F2937]/90 border border-zinc-700 p-4 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer group"
            >
              <span className="text-2xl mb-1 group-hover:scale-115 transition-transform">⚡</span>
              <span className="font-handwritten text-base font-bold text-accent-blue">A Dare</span>
              <span className="text-[9px] font-sans text-zinc-400 mt-1 uppercase tracking-wider">Accept Challenge</span>
            </motion.button>

            {/* Token 4: Secret Note */}
            <motion.button
              onClick={() => {
                SoundEngine.playPaperRustle();
                setActiveModal('secret');
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1F2937]/90 border border-zinc-700 p-4 rounded-xl shadow-lg flex flex-col items-center text-center cursor-pointer group"
            >
              <span className="text-2xl mb-1 group-hover:scale-115 transition-transform">🤖</span>
              <span className="font-handwritten text-base font-bold text-emerald-400">Secret Drawer</span>
              <span className="text-[9px] font-sans text-zinc-400 mt-1 uppercase tracking-wider">Builder Bot</span>
            </motion.button>

            {/* Token 5: Financial Freedom */}
            <motion.button
              onClick={() => {
                SoundEngine.playPopClick();
                setActiveModal('freedom');
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="col-span-2 bg-[#1F2937]/90 border border-amber-500/30 p-3.5 rounded-xl shadow-lg flex items-center justify-between px-4 text-left cursor-pointer group hover:border-amber-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-115 transition-transform">💸</span>
                <div>
                  <span className="font-handwritten text-base font-bold text-amber-300 block leading-tight">Financial Freedom</span>
                  <span className="text-[8.5px] font-sans text-zinc-400 uppercase tracking-wider">3D Compounding Token</span>
                </div>
              </div>
              <span className="text-[9px] text-amber-400/90 font-mono font-semibold bg-amber-950/60 border border-amber-600/30 px-2 py-0.5 rounded-full">
                View 3D ➔
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Active Modal Lightbox */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="bg-[#1F293D] border border-zinc-700/80 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative max-h-[85dvh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal 1: Memory Photo */}
              {activeModal === 'memory' && (
                <div className="flex flex-col items-center text-center">
                  <div className="relative aspect-square w-[220px] bg-zinc-900 rounded-sm overflow-hidden border border-zinc-700 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={capsule.memory.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <h3 className="font-handwritten text-xl font-bold text-accent-pink">{capsule.memory.caption}</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-zinc-400 mt-1">{capsule.memory.date}</p>
                </div>
              )}

              {/* Modal 2: Question with input */}
              {activeModal === 'question' && (
                <div className="flex flex-col">
                  <h3 className="font-handwritten text-xl font-bold text-accent-yellow mb-2">A Question For You 💭</h3>
                  <p className="text-sm text-zinc-300 font-sans mb-4 leading-relaxed">{capsule.question.text}</p>
                  <textarea
                    rows={3}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={capsule.question.placeholder || 'Type your reflection here, Ubaidullah...'}
                    className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-accent-pink font-sans resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={handleSaveAnswer}
                      className="px-5 py-2 bg-accent-pink text-white rounded-full text-xs font-bold font-sans hover:bg-accent-pink/90 active:scale-95 transition-all cursor-pointer"
                    >
                      Save to Capsule ♡
                    </button>
                  </div>
                </div>
              )}

              {/* Modal 3: Dare */}
              {activeModal === 'challenge' && (
                <div className="flex flex-col items-center text-center">
                  <span className="text-4xl mb-3">⚡</span>
                  <h3 className="font-handwritten text-2xl font-bold text-accent-blue mb-2">The Dare</h3>
                  <p className="text-base text-zinc-200 font-sans leading-relaxed my-2">{capsule.challenge.text}</p>
                  <span className="font-handwritten text-xs text-accent-pink mt-3 italic">no exceptions allowed.</span>
                </div>
              )}

              {/* Modal 4: Secret Note with 3D Robot */}
              {activeModal === 'secret' && (
                <div className="flex flex-col items-center text-center">
                  <div className="w-full h-36 relative mb-2">
                    <Canvas
                      shadows
                      dpr={[1, 1.5]}
                      gl={{ antialias: true, alpha: true }}
                      camera={{ position: [0, 0.4, 2.4], fov: 42 }}
                    >
                      <ambientLight intensity={1.2} />
                      <directionalLight position={[2, 4, 3]} intensity={1.5} />
                      <Suspense fallback={null}>
                        <ToyRobot3D
                          position={[0, -0.2, 0]}
                          scale={7.5}
                          interactive={true}
                        />
                        <OrbitControls
                          enableZoom={false}
                          maxPolarAngle={Math.PI / 1.8}
                          minPolarAngle={Math.PI / 3}
                        />
                      </Suspense>
                    </Canvas>
                  </div>
                  <h3 className="font-handwritten text-2xl font-bold text-emerald-400 mb-1">Builder Companion Unlocked 🤖</h3>
                  <p className="text-sm text-zinc-200 font-sans leading-relaxed my-1.5">{capsule.surprise.message}</p>
                  <p className="font-handwritten text-xs text-zinc-400 mt-2">{capsule.futureNote.text}</p>
                  <span className="text-[8.5px] font-mono text-zinc-500 mt-2">[ Click robot to make it spin & wave! ]</span>
                </div>
              )}

              {/* Modal 5: Financial Freedom with 3D Dollar */}
              {activeModal === 'freedom' && (
                <div className="flex flex-col items-center text-center">
                  <div className="w-full h-36 relative mb-2">
                    <Canvas
                      shadows
                      dpr={[1, 1.5]}
                      gl={{ antialias: true, alpha: true }}
                      camera={{ position: [0, 0.4, 2.0], fov: 42 }}
                    >
                      <ambientLight intensity={1.5} />
                      <directionalLight position={[2, 4, 3]} intensity={2.0} />
                      <Suspense fallback={null}>
                        <Dollar3D
                          position={[0, -0.05, 0]}
                          rotation={[0.65, 0.35, -0.1]}
                          scale={1.5}
                          interactive={true}
                        />
                        <OrbitControls
                          enableZoom={false}
                          maxPolarAngle={Math.PI / 1.8}
                          minPolarAngle={Math.PI / 3}
                        />
                      </Suspense>
                    </Canvas>
                  </div>
                  <h3 className="font-handwritten text-2xl font-bold text-amber-300 mb-1">Financial Freedom & Wisdom 💸</h3>
                  <p className="text-sm text-zinc-200 font-sans leading-relaxed my-1.5">
                    &quot;Quiet discipline over loud luxury. Save consistently, build high-leverage skills, and let patience do the heavy lifting.&quot;
                  </p>
                  <span className="text-[8.5px] font-mono text-amber-400/80 mt-2">[ Click dollar bill to flip 360° ]</span>
                </div>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="mt-6 mx-auto block px-4 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold font-sans transition-colors cursor-pointer"
              >
                Close ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="w-full flex flex-col items-center gap-3 z-30 pb-2">
        {jarState === 'open' && (
          <motion.button
            onClick={handleProceed}
            className="px-8 py-3 bg-white text-zinc-900 rounded-full font-handwritten text-xl font-black shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>sky of wishes ✨ →</span>
          </motion.button>
        )}

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={onBackToLetter}
            className="text-[10px] md:text-xs font-sans font-bold tracking-wider text-zinc-400 hover:text-zinc-200 uppercase transition-colors cursor-pointer"
          >
            [ Back to letter ]
          </button>
          <span className="text-zinc-600 font-bold select-none">•</span>
          <button
            onClick={onReplay}
            className="text-[10px] md:text-xs font-sans font-bold tracking-wider text-zinc-400 hover:text-zinc-200 uppercase transition-colors cursor-pointer"
          >
            [ Restart Scrapbook 🔄 ]
          </button>
        </div>
      </div>
    </div>
  );
};
