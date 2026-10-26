'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Parchment3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  floating?: boolean;
  children?: React.ReactNode;
}

export const Parchment3D: React.FC<Parchment3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.16,
  floating = true,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF('/models/parchment.glb');
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Warm up paper materials & polish scroll rollers
        if (mesh.material) {
          const processMat = (mat: THREE.Material) => {
            const m = mat.clone() as THREE.MeshStandardMaterial;
            if (m.name === 'GreenJade') {
              m.color = new THREE.Color('#5A3825'); // Polished walnut/mahogany scroll handles
              m.roughness = 0.35;
              m.metalness = 0.15;
            } else {
              m.roughness = 0.9;
              m.metalness = 0.02;
            }
            return m;
          };

          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(processMat);
          } else {
            mesh.material = processMat(mesh.material);
          }
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current || !floating) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.04;
    groupRef.current.rotation.z = rotation[2] + Math.sin(t * 1.2) * 0.015;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
      {children}
    </group>
  );
};

useGLTF.preload('/models/parchment.glb');
