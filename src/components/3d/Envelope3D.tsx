'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { memoriesConfig } from '@/config/memories.config';
import { SoundEngine } from '@/utils/audio';

interface Envelope3DProps {
  isOpen: boolean;
  onOpenTrigger: () => void;
  onProceed: () => void;
  accentColor?: string;
}

export const Envelope3D: React.FC<Envelope3DProps> = ({
  isOpen,
  onOpenTrigger,
  onProceed,
  accentColor = '#D47A8F',
}) => {
  const envelopeRef = useRef<THREE.Group>(null);
  const topFlapRef = useRef<THREE.Group>(null);
  const letterRef = useRef<THREE.Group>(null);

  const isDraggingLetter = useRef(false);
  const letterRotOffset = useRef<[number, number]>([0, 0]);
  const letterDragStart = useRef({ x: 0, y: 0 });

  const isDraggingEnvelope = useRef(false);
  const envelopeRotOffset = useRef<[number, number]>([0, 0]);
  const envelopeDragStart = useRef({ x: 0, y: 0 });
  const envelopeDragDistance = useRef(0);

  const baseColor = useMemo(() => new THREE.Color(accentColor), [accentColor]);
  const lightColor = useMemo(() => baseColor.clone().multiplyScalar(1.06), [baseColor]);
  const darkColor = useMemo(() => baseColor.clone().multiplyScalar(0.92), [baseColor]);
  const sealColor = useMemo(() => {
    const c = baseColor.clone();
    const hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    c.setHSL(hsl.h, Math.min(1, hsl.s * 1.35), Math.max(0.2, hsl.l * 0.72));
    return c;
  }, [baseColor]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (envelopeRef.current) {
      if (!isDraggingEnvelope.current) {
        envelopeRotOffset.current[0] = THREE.MathUtils.lerp(envelopeRotOffset.current[0], 0, 0.1);
        envelopeRotOffset.current[1] = THREE.MathUtils.lerp(envelopeRotOffset.current[1], 0, 0.1);
      }

      if (isOpen) {
        envelopeRef.current.position.y = THREE.MathUtils.lerp(envelopeRef.current.position.y, -0.95, 0.08);
        envelopeRef.current.position.z = THREE.MathUtils.lerp(envelopeRef.current.position.z, -0.4, 0.08);
        envelopeRef.current.rotation.x = THREE.MathUtils.lerp(envelopeRef.current.rotation.x, -Math.PI / 2 + 0.05, 0.08);
        envelopeRef.current.rotation.z = THREE.MathUtils.lerp(envelopeRef.current.rotation.z, 0, 0.08);
      } else {
        const floatY = -0.95 + 0.05 * Math.sin(time * 1.5);
        const rotZ = 0.12 + 0.02 * Math.cos(time * 0.8) + envelopeRotOffset.current[1];
        const rotX = -Math.PI / 2 + 0.05 + envelopeRotOffset.current[0];
        envelopeRef.current.position.y = floatY;
        envelopeRef.current.rotation.x = rotX;
        envelopeRef.current.rotation.z = rotZ;
      }
    }

    if (topFlapRef.current) {
      const targetFlapRot = isOpen ? -Math.PI + 0.15 : 0;
      topFlapRef.current.rotation.x = THREE.MathUtils.lerp(topFlapRef.current.rotation.x, targetFlapRot, 0.08);
    }

    if (!isDraggingLetter.current) {
      letterRotOffset.current[0] = THREE.MathUtils.lerp(letterRotOffset.current[0], 0, 0.1);
      letterRotOffset.current[1] = THREE.MathUtils.lerp(letterRotOffset.current[1], 0, 0.1);
    }

    if (letterRef.current) {
      const targetY = isOpen ? 2.3 : 0.25;
      const targetZ = isOpen ? 1.2 : 0.01;
      const targetRotX = isOpen ? Math.PI / 2 - 0.26 + letterRotOffset.current[0] : 0;
      const targetRotY = isOpen ? letterRotOffset.current[1] : 0;
      const targetRotZ = isOpen ? -0.08 * letterRotOffset.current[1] : 0;

      letterRef.current.position.y = THREE.MathUtils.lerp(letterRef.current.position.y, targetY, 0.07);
      letterRef.current.position.z = THREE.MathUtils.lerp(letterRef.current.position.z, targetZ, 0.07);
      letterRef.current.rotation.x = THREE.MathUtils.lerp(letterRef.current.rotation.x, targetRotX, 0.07);
      letterRef.current.rotation.y = THREE.MathUtils.lerp(letterRef.current.rotation.y, targetRotY, 0.07);
      letterRef.current.rotation.z = THREE.MathUtils.lerp(letterRef.current.rotation.z, targetRotZ, 0.07);
    }
  });

  return (
    <group
      ref={envelopeRef}
      position={[0, -0.95, 0]}
      rotation={[-Math.PI / 2 + 0.05, 0, 0.12]}
      onPointerDown={(e) => {
        if (!isOpen) {
          e.stopPropagation();
          isDraggingEnvelope.current = true;
          envelopeDragDistance.current = 0;
          envelopeDragStart.current = { x: e.clientX, y: e.clientY };
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          document.body.style.cursor = 'grabbing';
        }
      }}
      onPointerMove={(e) => {
        if (!isDraggingEnvelope.current || isOpen) return;
        e.stopPropagation();
        const dx = e.clientX - envelopeDragStart.current.x;
        const dy = e.clientY - envelopeDragStart.current.y;
        envelopeDragDistance.current += Math.abs(dx) + Math.abs(dy);
        envelopeRotOffset.current[0] += dy * 0.005;
        envelopeRotOffset.current[1] += dx * 0.005;
        envelopeRotOffset.current[0] = Math.max(-0.15, Math.min(0.15, envelopeRotOffset.current[0]));
        envelopeRotOffset.current[1] = Math.max(-0.25, Math.min(0.25, envelopeRotOffset.current[1]));
        envelopeDragStart.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        if (!isOpen) {
          e.stopPropagation();
          isDraggingEnvelope.current = false;
          (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
          document.body.style.cursor = 'grab';
          // If it was a quick click rather than a drag, open envelope!
          if (envelopeDragDistance.current < 8) {
            onOpenTrigger();
          }
        }
      }}
      onPointerOver={() => {
        if (!isOpen) document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        if (!isOpen) {
          document.body.style.cursor = 'auto';
          isDraggingEnvelope.current = false;
        }
      }}
    >
      {/* Outer Envelope Back */}
      <RoundedBox args={[4, 2.6, 0.14]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={baseColor} roughness={0.7} metalness={0.05} />
      </RoundedBox>

      {/* Inner Paper Bed */}
      <mesh position={[0, 0, 0.072]}>
        <planeGeometry args={[3.92, 2.52]} />
        <meshStandardMaterial color="#F9EBC5" roughness={0.8} />
      </mesh>

      {/* Letter Sliding Inside/Out */}
      <group
        ref={letterRef}
        position={[0, 0.25, 0.01]}
        onPointerDown={(e) => {
          if (isOpen) {
            e.stopPropagation();
            isDraggingLetter.current = true;
            letterDragStart.current = { x: e.clientX, y: e.clientY };
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            document.body.style.cursor = 'grabbing';
          }
        }}
        onPointerMove={(e) => {
          if (!isDraggingLetter.current || !isOpen) return;
          e.stopPropagation();
          const dx = e.clientX - letterDragStart.current.x;
          const dy = e.clientY - letterDragStart.current.y;
          letterRotOffset.current[0] += dy * 0.006;
          letterRotOffset.current[1] += dx * 0.006;
          letterRotOffset.current[0] = Math.max(-0.2, Math.min(0.2, letterRotOffset.current[0]));
          letterRotOffset.current[1] = Math.max(-0.4, Math.min(0.4, letterRotOffset.current[1]));
          letterDragStart.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          if (isOpen) {
            e.stopPropagation();
            isDraggingLetter.current = false;
            (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
            document.body.style.cursor = 'grab';
          }
        }}
      >
        {/* Letter Mesh Card */}
        <RoundedBox args={[3.7, 2.4, 0.05]} radius={0.04} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#FFFDF9" roughness={0.75} />
        </RoundedBox>

        {/* 3D HTML Content on the Letter */}
        {isOpen && (
          <Html
            position={[0, 0.05, 0.026]}
            transform
            occlude="blending"
            scale={0.4}
            className="w-[290px] h-[190px] select-none pointer-events-auto flex flex-col justify-between p-5"
          >
            <div className="w-full h-full flex flex-col justify-between text-left font-handwritten text-text-ink relative pointer-events-auto">
              {/* Paper red margin line */}
              <div className="absolute inset-y-0 -left-2 w-0.5 bg-red-200/40" />
              <div className="pr-2 leading-relaxed">
                <span className="text-2xl text-accent-pink font-extrabold block mb-1">
                  {memoriesConfig.intro.letterPreview.salutation}
                </span>
                <p className="text-[14px] font-bold text-text-ink/90">
                  {memoriesConfig.intro.letterPreview.body}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  SoundEngine.playPopClick();
                  document.body.style.cursor = 'auto';
                  onProceed();
                }}
                className="px-4 py-2 bg-accent-pink text-white font-bold rounded-full text-[11px] tracking-widest shadow-md hover:shadow-lg hover:bg-accent-pink/90 active:scale-95 transition-all self-end flex items-center gap-1.5 cursor-pointer pointer-events-auto z-50 font-sans my-2"
              >
                {memoriesConfig.intro.letterPreview.buttonText}
              </button>
            </div>
          </Html>
        )}
      </group>

      {/* Envelope Flaps (Sides and Bottom) */}
      <group position={[0, 0, 0.07]}>
        <RoundedBox args={[2, 2.6, 0.03]} radius={0.01} smoothness={3} position={[-1, 0, 0.015]} castShadow receiveShadow>
          <meshStandardMaterial color={lightColor} roughness={0.75} />
        </RoundedBox>
        <RoundedBox args={[2, 2.6, 0.03]} radius={0.01} smoothness={3} position={[1, 0, 0.015]} castShadow receiveShadow>
          <meshStandardMaterial color={lightColor} roughness={0.75} />
        </RoundedBox>
        <RoundedBox args={[4, 1.3, 0.04]} radius={0.01} smoothness={3} position={[0, -0.65, 0.03]} castShadow receiveShadow>
          <meshStandardMaterial color={darkColor} roughness={0.7} />
        </RoundedBox>
      </group>

      {/* Top Flap with Wax Seal */}
      <group ref={topFlapRef} position={[0, 1.3, 0.08]}>
        <group position={[0, -0.65, 0]}>
          <RoundedBox args={[4, 1.3, 0.03]} radius={0.01} smoothness={3} position={[0, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={baseColor} roughness={0.72} />
          </RoundedBox>
          {/* Clickable Wax Seal */}
          <mesh
            position={[0, -0.65, 0.03]}
            castShadow
            onClick={(e) => {
              e.stopPropagation();
              onOpenTrigger();
            }}
            onPointerOver={() => {
              if (!isOpen) document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              if (!isOpen) document.body.style.cursor = 'grab';
            }}
          >
            <cylinderGeometry args={[0.24, 0.24, 0.08, 32]} />
            <meshStandardMaterial color={sealColor} roughness={0.45} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
