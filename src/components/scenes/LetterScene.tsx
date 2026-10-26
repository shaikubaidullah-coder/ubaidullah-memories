'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Parchment3D } from '../3d/Parchment3D';
import { WashiTape } from '../WashiTape';
import { Doodle } from '../Doodles';
import { Sticker } from '../Sticker';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface LetterSceneProps {
  onContinue: () => void;
  onBackToDesk: () => void;
  onReplay: () => void;
}

export const LetterScene: React.FC<LetterSceneProps> = ({
  onContinue,
  onBackToDesk,
  onReplay,
}) => {
  const [stage, setStage] = useState<'closed' | 'open-flap' | 'slide-out' | 'unfolded'>('closed');
  const [salutationText, setSalutationText] = useState('');
  const [paragraphLines, setParagraphLines] = useState<string[]>([]);
  const [signatureText, setSignatureText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [is3DScroll, setIs3DScroll] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-400, 400], [5, -5]), { stiffness: 90, damping: 20 });
  const tiltY = useSpring(useTransform(mouseX, [-400, 400], [-5, 5]), { stiffness: 90, damping: 20 });

  const { letter, duo } = memoriesConfig;
  const polaroid = duo.polaroids[0];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(e.clientX - cx);
      mouseY.set(e.clientY - cy);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Open the envelope animation
  const handleOpenEnvelope = () => {
    if (stage !== 'closed' || isExiting) return;
    SoundEngine.playPopClick();
    setStage('open-flap');
    setTimeout(() => {
      SoundEngine.playPaperRustle();
      setStage('slide-out');
    }, 750);
    setTimeout(() => {
      setStage('unfolded');
    }, 1800);
  };

  // Streaming typewriter effect for letter
  useEffect(() => {
    if (stage !== 'unfolded') return;

    let isCancelled = false;
    setSalutationText('');
    setParagraphLines([]);
    setSignatureText('');
    setIsTypingComplete(false);

    const typeString = (str: string, onUpdate: (val: string) => void, speed = 25): Promise<void> => {
      return new Promise((resolve) => {
        let i = 0;
        const timer = setInterval(() => {
          if (isCancelled) {
            clearInterval(timer);
            resolve();
            return;
          }
          onUpdate(str.slice(0, i + 1));
          i++;
          if (i >= str.length) {
            clearInterval(timer);
            resolve();
          }
        }, speed);
      });
    };

    const streamAll = async () => {
      const salutation = `Dear ${letter.recipient},`;
      await typeString(salutation, setSalutationText, 40);
      if (isCancelled) return;

      for (let pIdx = 0; pIdx < letter.paragraphs.length; pIdx++) {
        setParagraphLines((prev) => [...prev, '']);
        await typeString(
          letter.paragraphs[pIdx],
          (curr) => {
            setParagraphLines((prev) => {
              const copy = [...prev];
              copy[pIdx] = curr;
              return copy;
            });
          },
          25
        );
        if (isCancelled) return;
      }

      await typeString(letter.signature, setSignatureText, 35);
      if (!isCancelled) {
        setIsTypingComplete(true);
        setTimeout(() => setShowButtons(true), 1200);
      }
    };

    streamAll();
    return () => {
      isCancelled = true;
    };
  }, [stage, letter]);

  const handleKeepMemory = () => {
    SoundEngine.playPopClick();
    setIsExiting(true);
    setTimeout(() => {
      onContinue();
    }, 1200);
  };

  return (
    <div className="relative w-full min-h-screen bg-paper flex flex-col items-center justify-start md:justify-center overflow-y-auto md:overflow-hidden py-10 pb-28 md:pb-10 px-4 select-none">
      {/* Background Soft Glow */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none z-0 mix-blend-multiply opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #FCD5B5 0%, #FAF1E7 50%, transparent 80%)',
        }}
      />

      {/* Opening line prompt above envelope */}
      <AnimatePresence>
        {stage === 'closed' && (
          <motion.div
            className="absolute top-[12%] text-center z-10 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.75, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-handwritten text-2xl md:text-3xl italic select-none text-text-ink/80">
              {letter.openingLine}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Pinned Items (Desktop only when unfolded) */}
      <AnimatePresence>
        {stage === 'unfolded' && (
          <>
            {/* Cafe Receipt on Left */}
            <motion.div
              className="absolute left-[5%] bottom-[12%] pointer-events-auto hidden xl:block z-20 w-[150px] bg-[#FAF8F4] border border-[#DFD8C4] shadow-sm p-4 rotate-[-8deg] font-mono text-[9px] text-[#2C2520]/70 cursor-grab active:cursor-grabbing"
              initial={{ opacity: 0, x: -50, rotate: -15 }}
              animate={{ opacity: 1, x: 0, rotate: -8 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
              drag
              dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
              onClick={() => SoundEngine.playPaperRustle()}
            >
              <WashiTape color="blue" className="-top-3 left-4 w-20 h-6 z-30" tilt={2} />
              <div className="text-center font-bold border-b border-dashed border-[#2C2520]/15 pb-1 mb-2 font-sans tracking-wide uppercase text-[8px] text-accent-pink">
                Bestie Cafe Receipt
              </div>
              <div className="flex justify-between my-1">
                <span>Matcha Latte</span>
                <span>$5.50</span>
              </div>
              <div className="flex justify-between my-1">
                <span>Warm Memories</span>
                <span>Priceless</span>
              </div>
              <div className="border-t border-dashed border-[#2C2520]/15 mt-2 pt-1 font-bold text-right text-[8px]">
                Total: Infinite ♡
              </div>
            </motion.div>

            {/* Pinned Polaroid on Right */}
            {polaroid && (
              <motion.div
                className="absolute right-[5%] bottom-[15%] pointer-events-auto hidden lg:block z-20 w-[160px] bg-white p-3 border border-zinc-200/70 shadow-md rotate-[6deg] cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                initial={{ opacity: 0, x: 50, rotate: 15 }}
                animate={{ opacity: 0.95, x: 0, rotate: 6 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
                drag
                dragConstraints={{ left: -40, right: 40, top: -40, bottom: 40 }}
                onClick={() => SoundEngine.playPaperRustle()}
              >
                <WashiTape color="pink" className="-top-3 left-4 w-20 h-6 z-30" tilt={-4} />
                <div className="aspect-square bg-zinc-100 overflow-hidden border border-zinc-200/50 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={polaroid.src} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="font-handwritten text-center text-xs text-text-ink/80 font-extrabold tracking-tight">
                  Where we began! 🌸
                </div>
              </motion.div>
            )}

            {/* Floating Stickers & Doodles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 hidden md:block">
              <Sticker emoji="🌸" className="absolute top-[8%] right-[15%]" rotation={-12} scale={0.7} />
              <Sticker emoji="☕" className="absolute bottom-[8%] right-[25%]" rotation={15} scale={0.65} />
              <Sticker emoji="✨" className="absolute top-[28%] left-[20%]" rotation={8} scale={0.6} />
              <Sticker emoji="💖" className="absolute bottom-[28%] left-[25%]" rotation={-8} scale={0.65} />
              <Doodle type="star" color="yellow" className="absolute top-[22%] right-[28%] w-6 h-6 opacity-30" delay={0.1} />
              <Doodle type="heart" color="pink" className="absolute bottom-[20%] left-[28%] w-8 h-8 opacity-25" delay={0.3} />
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Envelope / Letter Center View */}
      <div className="relative z-20 w-full flex items-center justify-center flex-col mt-4 md:mt-0">
        {stage !== 'unfolded' ? (
          /* Folded Envelope 3D Container */
          <motion.div
            onClick={handleOpenEnvelope}
            className="relative w-[min(88vw,440px)] aspect-[1.5/1] z-20 cursor-pointer focus:outline-none group rounded-md"
            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            animate={stage === 'slide-out' ? { y: 120, opacity: 0.8, scale: 0.95 } : { y: 0 }}
            transition={{ duration: 1.0, ease: 'easeInOut' }}
          >
            {/* Envelope Back Body */}
            <div className="absolute inset-0 bg-text-ink/5 rounded-md blur-md transform translate-y-2 translate-x-1" />
            <div className="absolute inset-0 bg-[#FAF7F0] border border-[#EBE5D3] rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-[#F4EFE3] opacity-60" />
            </div>

            {/* Paper sliding out preview */}
            <motion.div
              className="absolute inset-x-4 top-2 bg-[#FCFAF5] rounded-xs border border-[#E9DFB9]/60 p-6 flex flex-col font-handwritten select-none z-5 h-[90%]"
              animate={stage === 'slide-out' ? { y: -220, scale: 1.02 } : { y: 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
            >
              <div className="absolute top-0 bottom-0 left-5 w-[1px] bg-accent-pink/15" />
              <div className="pl-4 pt-2">
                <span className="font-extrabold text-text-ink/40 text-lg">Dear {letter.recipient},</span>
                <div className="w-full h-2 bg-text-ink/5 rounded-full mt-4" />
                <div className="w-2/3 h-2 bg-text-ink/5 rounded-full mt-2" />
                <div className="w-3/4 h-2 bg-text-ink/5 rounded-full mt-2" />
              </div>
            </motion.div>

            {/* Envelope Pocket Flaps */}
            <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none z-10">
              <div
                className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#F9F5EC] border-r border-[#EBE5D3]/60 shadow-xs"
                style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
              />
              <div
                className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#F9F5EC] border-l border-[#EBE5D3]/60 shadow-xs"
                style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-2/3 bg-[#F6F1E5] border-t border-[#EBE5D3]/60 shadow-xs"
                style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
              />
            </div>

            {/* Top Hinge Flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2 bg-[#FAF7F0] border-b border-[#EBE5D3]/50 z-20"
              style={{ transformOrigin: 'top center', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              animate={stage !== 'closed' ? { rotateX: 180, zIndex: 0, opacity: 0.9 } : { rotateX: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Pulsing Wax Seal on Flap */}
            {stage === 'closed' && (
              <motion.div
                className="absolute top-[42%] left-[45%] w-[10%] aspect-square bg-accent-pink rounded-full z-30 flex items-center justify-center border border-white/40 shadow-md"
                animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-xs text-white font-extrabold select-none">♡</span>
              </motion.div>
            )}

            {/* "open me..." text below */}
            {stage === 'closed' && (
              <motion.div
                className="absolute bottom-[-2.5rem] left-0 right-0 text-center z-30"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <span className="font-handwritten text-lg text-text-ink/70 italic select-none">open me...</span>
              </motion.div>
            )}
          </motion.div>
        ) : is3DScroll ? (
          /* 3D Parchment Scroll View */
          <motion.div
            className="relative w-[min(92vw,580px)] h-[540px] bg-amber-50/30 border border-amber-200/60 rounded-2xl shadow-2xl p-4 flex flex-col justify-between overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center px-3 py-1.5 z-30 bg-white/80 backdrop-blur-xs rounded-full border border-amber-200/60 text-[10px] font-mono shadow-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <span>📜</span> 3D Living Parchment Scroll
              </span>
              <button
                onClick={() => {
                  SoundEngine.playPopClick();
                  setIs3DScroll(false);
                }}
                className="text-[9px] text-accent-pink font-bold hover:underline cursor-pointer bg-white px-2 py-0.5 rounded-full border border-pink-200"
              >
                Switch to Flat Sheet ✉️
              </button>
            </div>
            <div className="absolute inset-0 z-10">
              <Canvas
                shadows
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [0, 0, 4.4], fov: 42 }}
              >
                <ambientLight intensity={1.2} />
                <directionalLight position={[2, 4, 3]} intensity={1.6} />
                <pointLight position={[0, 0, 2]} color="#FFA726" intensity={1.2} distance={5} />
                <Suspense fallback={null}>
                  <Parchment3D
                    position={[0, 0, 0]}
                    rotation={[0.04, 0, 0]}
                    scale={0.17}
                  />
                  <OrbitControls
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 1.8}
                    minPolarAngle={Math.PI / 2.3}
                    maxAzimuthAngle={Math.PI / 5}
                    minAzimuthAngle={-Math.PI / 5}
                  />
                </Suspense>
              </Canvas>
            </div>
            {/* Overlay Calligraphy in 3D Scroll */}
            <div className="relative z-20 pointer-events-none p-4 sm:p-8 pt-8 text-center font-handwritten text-text-ink/90 flex flex-col justify-center h-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-950 mb-3 drop-shadow-xs">
                {salutationText}
              </h2>
              <div className="space-y-2 text-xs sm:text-sm md:text-base leading-relaxed text-amber-900 font-bold max-w-[420px] mx-auto drop-shadow-xs">
                {paragraphLines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
              <div className="mt-4 text-right text-base sm:text-lg md:text-xl font-extrabold text-accent-pink pr-6 drop-shadow-xs">
                {signatureText}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Unfolded Letter Sheet */
          <motion.div
            className="relative bg-[#FCFAF5] w-[min(92vw,580px)] rounded-[3px] border border-[#E9DFB9]/70 p-4 sm:p-6 md:p-10 text-left pointer-events-auto flex flex-col font-handwritten select-none cursor-grab active:cursor-grabbing"
            style={{
              boxShadow: '0 12px 36px rgba(44,37,32,0.08), 0 2px 4px rgba(44,37,32,0.04)',
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: 'preserve-3d',
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
          >
            {/* Top Bar with 3D Parchment Switcher */}
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-zinc-100 z-20">
              <span className="text-[9px] font-mono text-zinc-400">Shaik Ubaidullah Vault</span>
              <button
                onClick={() => {
                  SoundEngine.playPopClick();
                  setIs3DScroll(true);
                }}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-full text-[9px] font-sans font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <span>📜</span> View in 3D Ancient Parchment
              </button>
            </div>
            {/* Paper Red Margin Line */}
            <div className="absolute top-0 bottom-0 left-6 md:left-14 w-[1px] bg-red-300/30 pointer-events-none" />

            {/* Subtle Paper Noise Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply rounded-[3px]"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              }}
            />

            {/* Letter Content Container */}
            <div className="pl-6 md:pl-10 relative z-10 flex-grow pr-2">
              <h2 className="text-xl md:text-3xl font-extrabold text-text-ink/90 mb-5 min-h-[36px]">
                {salutationText}
              </h2>
              <div className="space-y-4 text-base md:text-xl text-text-ink/80 leading-relaxed font-semibold">
                {paragraphLines.map((line, idx) => (
                  <p key={idx} className="min-h-[26px]">
                    {line}
                  </p>
                ))}
              </div>
              <div className="mt-8 text-right text-lg md:text-2xl font-extrabold text-accent-pink min-h-[32px] pr-2">
                {signatureText}
              </div>
            </div>

            {/* Dog-eared Secret Corner Fold */}
            {isTypingComplete && (
              <div className="absolute bottom-0 right-0 z-30 pointer-events-auto">
                <button
                  onClick={() => {
                    SoundEngine.playPopClick();
                    setIsSecretRevealed(!isSecretRevealed);
                  }}
                  className="absolute bottom-0 right-0 w-12 h-12 bg-transparent cursor-pointer group"
                  title="A secret fold..."
                >
                  <div
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#EFE8D6] shadow-sm border-t border-l border-[#D5CBB8] transition-transform group-hover:scale-115"
                    style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
                  />
                </button>

                <AnimatePresence>
                  {isSecretRevealed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute bottom-12 right-0 bg-[#FFFDF9] border border-[#DFD6BE] shadow-xl p-3 rounded-sm min-w-[200px] text-center"
                    >
                      <span className="font-handwritten text-xs text-accent-pink font-bold block">
                        {letter.closingMessage}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* Buttons below the unfolded letter */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              className="relative md:absolute mt-8 md:mt-0 bottom-auto md:bottom-[4%] left-auto md:left-0 right-auto md:right-0 flex flex-col items-center gap-3 z-30 pointer-events-auto w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.8 }}
            >
              <motion.button
                onClick={handleKeepMemory}
                className="relative px-8 py-3 bg-[#FFFDF9] text-text-ink border-2 border-text-ink/15 shadow-sm rounded-sm hover:shadow-md active:scale-95 hover:border-accent-pink hover:text-accent-pink cursor-pointer font-handwritten text-xl font-bold transition-all group"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <WashiTape color="yellow" className="-top-2.5 -left-3 w-7 h-4 rotate-[-15deg]" />
                <WashiTape color="pink" className="-bottom-2 -right-3 w-7 h-4 rotate-[15deg]" />
                <span className="relative z-10">keep this memory →</span>
              </motion.button>

              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={onBackToDesk}
                  className="text-[10px] md:text-xs font-sans font-bold tracking-wider text-text-ink/50 hover:text-text-ink uppercase transition-colors cursor-pointer"
                >
                  [ Go back to desk ]
                </button>
                <span className="text-text-ink/20 font-bold select-none">•</span>
                <button
                  onClick={() => {
                    SoundEngine.playPopClick();
                    setStage('closed');
                    setShowButtons(false);
                  }}
                  className="text-[10px] md:text-xs font-sans font-bold tracking-wider text-text-ink/50 hover:text-text-ink uppercase transition-colors cursor-pointer"
                >
                  [ Read Again 🔄 ]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
