'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { SoundEngine } from '@/utils/audio';

interface Dollar3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export const Dollar3D: React.FC<Dollar3DProps> = ({
  position = [0, 0, 0],
  rotation = [0.6, 0.35, -0.1],
  scale = 1.3,
  interactive = true,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);

  const { scene } = useGLTF('/models/dollar.glb');
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
    SoundEngine.playPopClick();
    setFlipProgress((prev) => prev + Math.PI * 2);
    if (onClick) onClick();
  };

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (flipProgress > 0.01) {
      setFlipProgress((prev) => prev * 0.88);
      groupRef.current.rotation.y += 0.28;
    } else {
      groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.04;
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 1.5) * 0.25;
      groupRef.current.rotation.z = rotation[2] + Math.cos(t * 1.2) * 0.08;
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
      <Center>
        <primitive object={clonedScene} />
      </Center>

      {/* Golden Shimmer Light */}
      <pointLight
        position={[0, 0.2, 0.4]}
        color="#FDE047"
        intensity={hovered ? 2.5 : 1.2}
        distance={2.5}
      />
    </group>
  );
};

useGLTF.preload('/models/dollar.glb');
