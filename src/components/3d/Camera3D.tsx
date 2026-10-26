'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SoundEngine } from '@/utils/audio';

interface Camera3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  interactive?: boolean;
  onSnap?: () => void;
}

export const Camera3D: React.FC<Camera3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  interactive = true,
  onSnap,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const { scene } = useGLTF('/models/camera.glb');
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
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 220);

    if (onSnap) {
      onSnap();
    }
  };

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (interactive && hovered) {
      groupRef.current.position.y = position[1] + 0.08 + Math.sin(t * 4) * 0.03;
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 2) * 0.15;
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1], 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation[1], 0.1);
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

      {/* Camera Flash Point Light */}
      <pointLight
        ref={flashLightRef}
        position={[0, 0.4, 0.6]}
        color="#E0F7FA"
        intensity={isFlashing ? 12 : 0}
        distance={6}
      />
    </group>
  );
};

useGLTF.preload('/models/camera.glb');
