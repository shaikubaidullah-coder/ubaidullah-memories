'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { LivingMemory3D } from '../3d/LivingMemory3D';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface SkySceneProps {
  onContinue: () => void;
}

// Camera controller stage interpolator
const CameraController = ({ stage }: { stage: string }) => {
  const targetPos = useRef(new THREE.Vector3(0, 3.5, 9));
  const targetLook = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame((state) => {
    switch (stage) {
      case 'transition-entry':
        targetPos.current.set(0, 4.0, 12);
        targetLook.current.set(0, 1.0, 0);
        break;
      case 'room-reveal':
        targetPos.current.set(0.6, 2.5, 7.0);
        targetLook.current.set(0, 0.5, 0);
        break;
      case 'camera-focus':
      case 'waiting-for-tap':
        targetPos.current.set(0, 1.8, 5.0);
        targetLook.current.set(0, 0, 0);
        break;
      case 'photo-lifting':
      case 'living-memory':
      case 'final-messages':
        targetPos.current.set(0, 2.2, 5.2);
        targetLook.current.set(0, 2.0, 0);
        break;
    }

    state.camera.position.lerp(targetPos.current, 0.04);
    state.camera.lookAt(targetLook.current);
  });

  return null;
};

export const SkyScene: React.FC<SkySceneProps> = ({ onContinue }) => {
  const [stage, setStage] = useState<
    'transition-entry' | 'room-reveal' | 'camera-focus' | 'waiting-for-tap' | 'photo-lifting' | 'living-memory' | 'final-messages'
  >('transition-entry');
  const [showLoading, setShowLoading] = useState(true);

  const { finale } = memoriesConfig;
  const heroPhoto = '/images/me/photo_3_pillar_portrait.jpg';

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowLoading(false);
      setStage('room-reveal');
    }, 1200);

    const t2 = setTimeout(() => {
      setStage('camera-focus');
    }, 3800);

    const t3 = setTimeout(() => {
      setStage('waiting-for-tap');
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handlePhotoClick = () => {
    if (stage === 'waiting-for-tap') {
      SoundEngine.playSparkle();
      setStage('photo-lifting');
      setTimeout(() => {
        setStage('living-memory');
      }, 1200);
      setTimeout(() => {
        setStage('final-messages');
      }, 3000);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden select-none bg-gradient-to-b from-[#0B0F19] to-[#030712] text-zinc-100">
      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 3.5, 9], fov: 42 }} className="w-full h-full relative z-0">
        <ambientLight intensity={stage === 'living-memory' ? 0.4 : 0.8} color="#CBD5E1" />
        <directionalLight castShadow position={[4, 8, 3]} intensity={1.1} color="#E2E8F0" />
        <CameraController stage={stage} />
        <Suspense fallback={null}>
          <LivingMemory3D stage={stage} heroPhotoSrc={heroPhoto} onPhotoClick={handlePhotoClick} />
        </Suspense>
        <Sparkles count={50} scale={10} size={1.8} speed={0.3} color="#F7E5A9" />
      </Canvas>

      {/* Loading Overlay */}
      <AnimatePresence>
        {showLoading && (
          <motion.div
            className="fixed inset-0 bg-[#0F172A] z-50 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <p className="font-handwritten text-2xl text-accent-pink italic animate-pulse">
              loading final memory...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction button to tap photo */}
      <AnimatePresence>
        {stage === 'waiting-for-tap' && (
          <motion.div
            className="absolute bottom-[24%] left-0 right-0 flex justify-center pointer-events-none z-30"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.95, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
          >
            <button
              onClick={handlePhotoClick}
              className="font-handwritten text-2xl md:text-3xl text-accent-pink font-extrabold italic animate-bounce cursor-pointer pointer-events-auto bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-accent-pink/40 shadow-lg"
            >
              {finale.instruction}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Sentimental Message Card */}
      <AnimatePresence>
        {(stage === 'living-memory' || stage === 'final-messages') && (
          <motion.div
            className="absolute bottom-[8%] left-0 right-0 flex flex-col items-center justify-end px-6 z-30 pointer-events-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8 }}
          >
            <h3 className="font-handwritten text-2xl md:text-3xl text-accent-pink font-extrabold italic mb-4 drop-shadow-md select-none text-center">
              {finale.caption}
            </h3>

            {stage === 'final-messages' && (
              <motion.div
                className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 p-5 sm:p-6 md:p-8 rounded-2xl max-w-md w-full max-h-[72dvh] overflow-y-auto text-center pointer-events-auto flex flex-col font-handwritten relative shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
              >
                <div className="text-xl md:text-2xl text-zinc-100 font-bold leading-relaxed mb-3">
                  {finale.finalMessage}
                </div>
                <div className="text-base md:text-lg text-accent-pink/90 font-bold mb-4">
                  {finale.finalSubtext}
                </div>
                <div className="text-right text-base text-zinc-400 font-sans font-bold">
                  {finale.signature}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-center">
                  <button
                    onClick={() => {
                      SoundEngine.playPopClick();
                      onContinue();
                    }}
                    className="px-6 py-2.5 bg-accent-pink hover:bg-accent-pink/90 text-white font-sans text-xs uppercase tracking-widest font-black rounded-full shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    Replay the entire journey 🔄
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
