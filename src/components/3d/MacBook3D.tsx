'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SoundEngine } from '@/utils/audio';

interface MacBook3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  interactive?: boolean;
}

export const MacBook3D: React.FC<MacBook3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  interactive = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const screenGlowRef = useRef<THREE.PointLight>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'terminal' | 'stats'>('code');
  const [hovered, setHovered] = useState(false);

  const { scene } = useGLTF('/models/macbook.glb');
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  const handleScreenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playPopClick();
    setActiveTab((prev) => (prev === 'code' ? 'terminal' : prev === 'terminal' ? 'stats' : 'code'));
  };

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (screenGlowRef.current) {
      screenGlowRef.current.intensity = 1.2 + Math.sin(t * 3) * 0.2;
    }

    if (interactive) {
      if (hovered) {
        groupRef.current.position.y = position[1] + 0.04 + Math.sin(t * 2) * 0.015;
      } else {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1], 0.1);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        if (interactive) {
          e.stopPropagation();
          setHovered(true);
        }
      }}
      onPointerOut={() => {
        if (interactive) {
          setHovered(false);
        }
      }}
    >
      <primitive object={clonedScene} />

      {/* Screen Glow Light */}
      <pointLight
        ref={screenGlowRef}
        position={[0.02, 0.75, -0.4]}
        color="#70B4FF"
        intensity={1.2}
        distance={3.5}
      />

      {/* Interactive 3D HTML Screen Overlay */}
      <Html
        transform
        distanceFactor={1.4}
        position={[0.02, 0.75, -0.64]}
        rotation={[0, 0, 0]}
        className="pointer-events-auto select-none"
      >
        <div
          onClick={handleScreenClick}
          className="w-[280px] h-[190px] bg-[#0E131F]/95 border border-cyan-500/25 rounded-md p-3 shadow-xl flex flex-col justify-between font-mono text-[9px] text-zinc-300 backdrop-blur-md cursor-pointer transition-all hover:border-cyan-400"
          title="Click to toggle developer tab"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500/80" />
              <div className="w-2 h-2 rounded-full bg-amber-500/80" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[8px] font-sans text-zinc-400 font-semibold tracking-wider flex items-center gap-1">
              <span className="text-cyan-400">⚡</span>
              <span>{activeTab === 'code' ? 'mindset.ts' : activeTab === 'terminal' ? 'bash - agy' : 'vital-stats'}</span>
            </div>
            <div className="text-[7px] text-zinc-400">click to switch</div>
          </div>

          {/* Screen Content by Tab */}
          <div className="flex-1 overflow-hidden leading-tight font-mono text-[8.5px]">
            {activeTab === 'code' && (
              <div className="space-y-0.5">
                <p className="text-zinc-400">{'// Shaik Ubaidullah — Core Architecture'}</p>
                <p>
                  <span className="text-purple-400">const</span>{' '}
                  <span className="text-amber-300">philosophy</span> = &#123;
                </p>
                <p className="pl-2">
                  <span className="text-cyan-400">heart</span>:{' '}
                  <span className="text-emerald-300">&quot;Kind & Friendly&quot;</span>,
                </p>
                <p className="pl-2">
                  <span className="text-cyan-400">intellect</span>:{' '}
                  <span className="text-emerald-300">&quot;Deeply Practical&quot;</span>,
                </p>
                <p className="pl-2">
                  <span className="text-cyan-400">focus</span>:{' '}
                  <span className="text-emerald-300">&quot;Quiet consistency&quot;</span>,
                </p>
                <p className="pl-2">
                  <span className="text-cyan-400">rule</span>:{' '}
                  <span className="text-emerald-300">&quot;Zero fluff. Real outcomes.&quot;</span>
                </p>
                <p>&#125;;</p>
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="space-y-1 text-emerald-400">
                <p className="text-zinc-400">$ ./build-future.sh --stealth</p>
                <p>✔ Self-discipline: 100%</p>
                <p>✔ Inner peace: Uncompromised</p>
                <p>✔ Practical problem solving: ACTIVE</p>
                <p className="text-cyan-300 animate-pulse">Running live build loop...</p>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-1 text-zinc-300">
                <div className="flex justify-between border-b border-zinc-800/60 pb-0.5">
                  <span className="text-zinc-400">Discipline</span>
                  <span className="text-amber-400 font-bold">Unshakable</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/60 pb-0.5">
                  <span className="text-zinc-400">Kindness</span>
                  <span className="text-rose-400 font-bold">Non-negotiable</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/60 pb-0.5">
                  <span className="text-zinc-400">Trajectory</span>
                  <span className="text-emerald-400 font-bold">Exponential</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Status Line */}
          <div className="pt-1.5 border-t border-zinc-800 text-[7px] text-zinc-400 flex justify-between items-center">
            <span>macOS Sonoma • Zsh</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" /> online
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};

useGLTF.preload('/models/macbook.glb');
