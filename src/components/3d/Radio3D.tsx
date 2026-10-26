'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SoundEngine } from '@/utils/audio';

interface Radio3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  interactive?: boolean;
  isPlaying?: boolean;
  onTune?: () => void;
}

export const Radio3D: React.FC<Radio3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  interactive = true,
  isPlaying = false,
  onTune,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  const { scene } = useGLTF('/models/radio.glb');
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

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!interactive) return;

    SoundEngine.playPopClick();
    if (onTune) {
      onTune();
    }
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (glowLightRef.current) {
      if (isPlaying) {
        glowLightRef.current.intensity = 1.8 + Math.sin(t * 8) * 0.8;
      } else {
        glowLightRef.current.intensity = hovered ? 1.0 : 0.3;
      }
    }

    if (groupRef.current && interactive) {
      if (hovered) {
        groupRef.current.position.y = position[1] + 0.05 + Math.sin(t * 3) * 0.02;
        groupRef.current.rotation.y = rotation[1] + Math.sin(t * 2) * 0.08;
      } else {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1], 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation[1], 0.1);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={(e) => {
        if (interactive) {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        if (interactive) {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }
      }}
    >
      <primitive object={clonedScene} />

      {/* Warm Retro Dial Glow */}
      <pointLight
        ref={glowLightRef}
        position={[0, 0.8, 0.4]}
        color="#FFA726"
        intensity={0.5}
        distance={3.5}
      />
    </group>
  );
};

useGLTF.preload('/models/radio.glb');
