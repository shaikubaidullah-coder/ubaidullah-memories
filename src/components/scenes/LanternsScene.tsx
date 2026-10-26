'use client';

import React, { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { ToyPlane3D } from '../3d/ToyPlane3D';
import { Dollar3D } from '../3d/Dollar3D';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface LanternProps {
  initialPos: [number, number, number];
  wishText: string;
  speed?: number;
}

const FloatingLantern: React.FC<LanternProps> = ({ initialPos, wishText, speed = 0.4 }) => {
  const meshRef = useRef<THREE.Group>(null);
  const posY = useRef(initialPos[1]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      posY.current += 0.008 * speed;
      if (posY.current > 12) {
        posY.current = -5;
      }
      meshRef.current.position.y = posY.current;
      meshRef.current.position.x = initialPos[0] + 0.3 * Math.sin(time * 0.8 + initialPos[0]);
      meshRef.current.rotation.y = 0.2 * Math.sin(time * 0.5 + initialPos[2]);
      meshRef.current.rotation.z = 0.05 * Math.sin(time * 0.7);
    }
  });

  return (
    <group ref={meshRef} position={initialPos}>
      {/* Lantern Outer Paper Cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.38, 0.9, 16]} />
        <meshStandardMaterial
          color="#FFD180"
          emissive="#FF9100"
          emissiveIntensity={0.8}
          roughness={0.4}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Inner Flame Light */}
      <pointLight color="#FFA726" intensity={1.8} distance={3} />

      {/* Bottom Rim */}
      <mesh position={[0, -0.45, 0]}>
        <torusGeometry args={[0.36, 0.03, 8, 16]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.7} />
      </mesh>

      {/* Floating Wish Note Tag */}
      <Html position={[0, -0.7, 0]} center distanceFactor={8} className="pointer-events-none select-none">
        <div className="bg-black/60 backdrop-blur-xs text-amber-100 text-[10px] font-handwritten px-3 py-1 rounded-full whitespace-nowrap border border-amber-400/30 shadow-md">
          {wishText}
        </div>
      </Html>
    </group>
  );
};

interface LanternsSceneProps {
  onContinue: () => void;
  onBack: () => void;
}

export const LanternsScene: React.FC<LanternsSceneProps> = ({ onContinue, onBack }) => {
  const { lanterns } = memoriesConfig;
  const [wishes, setWishes] = useState<string[]>(lanterns.initialWishes);
  const [newWishInput, setNewWishInput] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  // Distribute initial positions
  const lanternList = useMemo(() => {
    return wishes.map((wish, idx) => {
      const angle = (idx * Math.PI * 2) / wishes.length;
      const radius = 2.5 + (idx % 3) * 1.2;
      return {
        id: `lantern_${idx}`,
        pos: [
          radius * Math.cos(angle),
          -2 + (idx * 2.5) % 8,
          -2 - (idx % 4) * 2,
        ] as [number, number, number],
        wish,
        speed: 0.35 + (idx % 3) * 0.15,
      };
    });
  }, [wishes]);

  const handleAddWish = () => {
    if (!newWishInput.trim()) return;
    SoundEngine.playSparkle();
    setWishes((prev) => [...prev, newWishInput.trim()]);
    setNewWishInput('');
    setShowPrompt(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-gradient-to-b from-[#060814] via-[#0E1326] to-[#04060E] text-zinc-100">
      {/* 3D Night Sky with Floating Lanterns */}
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }} className="w-full h-full relative z-0">
        <ambientLight intensity={0.2} color="#1E293B" />
        <directionalLight position={[0, 10, 5]} intensity={0.4} color="#94A3B8" />

        {lanternList.map((item) => (
          <FloatingLantern key={item.id} initialPos={item.pos} wishText={item.wish} speed={item.speed} />
        ))}

        <Suspense fallback={null}>
          {/* Soaring Dream Airplane through the Wishing Sky */}
          <ToyPlane3D
            position={[0, 4.2, -4]}
            rotation={[0.1, 0, 0]}
            scale={14}
            flightPath={true}
            interactive={true}
          />

          {/* Floating Financial Freedom Golden Talisman */}
          <Dollar3D
            position={[3.2, 0.2, -3]}
            rotation={[0, 0.4, 0.1]}
            scale={1.3}
            interactive={true}
          />
        </Suspense>

        {/* Ambient Starlight Sparkles */}
        <Sparkles count={60} scale={12} size={2.0} speed={0.25} color="#FFE082" />
      </Canvas>

      {/* Header Overlay */}
      <div className="absolute top-12 md:top-8 left-0 right-0 px-6 md:px-0 text-center pointer-events-none z-20">
        <span className="font-handwritten text-lg text-accent-yellow tracking-wider font-extrabold uppercase select-none block mb-1">
          wishing stars
        </span>
        <h1 className="font-sans text-3xl md:text-5xl font-black tracking-tight leading-none text-zinc-100">
          {lanterns.title}
        </h1>
        <p className="font-handwritten text-base md:text-lg font-bold italic mt-1.5 text-zinc-400">
          {lanterns.subtitle}
        </p>
      </div>

      {/* Release Lantern Trigger Button */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <motion.button
          onClick={() => {
            SoundEngine.playPopClick();
            setShowPrompt(true);
          }}
          className="pointer-events-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-accent-pink text-white font-sans text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/20"
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <span>Release a Lantern ✨</span>
        </motion.button>
      </div>

      {/* Add Wish Prompt Modal */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPrompt(false)}
          >
            <motion.div
              className="bg-[#181E36] border border-amber-400/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-3xl mb-2 block">🏮</span>
              <h3 className="font-handwritten text-2xl font-bold text-amber-300 mb-2">Write a Wish</h3>
              <p className="text-xs text-zinc-400 font-sans mb-4">
                What wish or memory do you want to float up into the sky?
              </p>
              <input
                type="text"
                value={newWishInput}
                onChange={(e) => setNewWishInput(e.target.value)}
                placeholder="e.g., Safe travels & big success..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-sans"
                maxLength={60}
              />
              <div className="flex justify-center gap-3 mt-5">
                <button
                  onClick={() => setShowPrompt(false)}
                  className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold font-sans cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWish}
                  className="px-5 py-2 rounded-full bg-amber-400 text-zinc-900 text-xs font-black font-sans hover:bg-amber-300 transition-all cursor-pointer shadow-md"
                >
                  Send to Sky ✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 z-20">
        <button
          onClick={onBack}
          className="text-xs font-sans font-bold tracking-wider text-zinc-400 hover:text-zinc-200 uppercase transition-colors cursor-pointer"
        >
          [ ← Back to Capsule ]
        </button>
        <button
          onClick={() => {
            SoundEngine.playSparkle();
            onContinue();
          }}
          className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-sans font-bold uppercase tracking-widest text-zinc-100 transition-all cursor-pointer"
        >
          Final Living Memory →
        </button>
      </div>
    </div>
  );
};
