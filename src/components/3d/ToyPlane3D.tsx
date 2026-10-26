'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { SoundEngine } from '@/utils/audio';

interface ToyPlane3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  targetX?: number;
  flightPath?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const ToyPlane3D: React.FC<ToyPlane3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 14,
  color = '#E1526D',
  targetX,
  flightPath = true,
  interactive = true,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const { scene } = useGLTF('/models/toy-plane.glb');
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.color = new THREE.Color(color);
          mat.roughness = 0.35;
          mat.metalness = 0.25;
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [scene, color]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (flightPath) {
      // Dynamic banking and cruising flight
      if (typeof targetX === 'number') {
        const currentX = groupRef.current.position.x;
        const diffX = targetX - currentX;
        groupRef.current.position.x = THREE.MathUtils.lerp(currentX, targetX, 0.05);
        // Bank into the turn
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -diffX * 0.35, 0.08);
      } else {
        groupRef.current.position.x = position[0] + Math.sin(t * 0.8) * 0.8;
        groupRef.current.rotation.z = Math.cos(t * 0.8) * 0.15;
      }

      groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.15;
      groupRef.current.rotation.x = rotation[0] + Math.sin(t * 1.5) * 0.08;
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.7) * 0.1;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    SoundEngine.playPopClick();
    if (onClick) onClick();
  };

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

      {/* Tiny plane wing lights */}
      <pointLight position={[0.4, 0, 0]} color="#4ADE80" intensity={0.4} distance={1.5} />
      <pointLight position={[-0.4, 0, 0]} color="#F43F5E" intensity={0.4} distance={1.5} />
    </group>
  );
};

useGLTF.preload('/models/toy-plane.glb');
