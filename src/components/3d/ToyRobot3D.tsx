'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { SoundEngine } from '@/utils/audio';

interface ToyRobot3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export const ToyRobot3D: React.FC<ToyRobot3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 6.5,
  interactive = true,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [spinBoost, setSpinBoost] = useState(0);

  const { scene } = useGLTF('/models/toy-robot.glb');
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
    setSpinBoost((prev) => prev + Math.PI * 2);
    if (onClick) onClick();
  };

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (spinBoost > 0.01) {
      setSpinBoost((prev) => prev * 0.88);
      groupRef.current.rotation.y += 0.25;
    } else {
      if (hovered) {
        groupRef.current.position.y = position[1] + 0.08 + Math.sin(t * 6) * 0.04;
        groupRef.current.rotation.z = Math.sin(t * 5) * 0.12;
      } else {
        groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.02;
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, rotation[2], 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation[1] + Math.sin(t * 1.2) * 0.15, 0.1);
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
      <Center>
        <primitive object={clonedScene} />
      </Center>

      {/* Playful Robot Chest & Eye Glow */}
      <pointLight position={[0, 0.1, 0.3]} color="#38BDF8" intensity={hovered ? 2.5 : 1.0} distance={2} />
      <pointLight position={[0, -0.2, 0.2]} color="#FBBF24" intensity={0.6} distance={1.5} />
    </group>
  );
};

useGLTF.preload('/models/toy-robot.glb');
