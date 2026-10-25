'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface LivingMemory3DProps {
  stage: 'transition-entry' | 'room-reveal' | 'camera-focus' | 'waiting-for-tap' | 'photo-lifting' | 'living-memory' | 'final-messages';
  heroPhotoSrc: string;
  onPhotoClick: () => void;
}

export const LivingMemory3D: React.FC<LivingMemory3DProps> = ({
  stage,
  heroPhotoSrc,
  onPhotoClick,
}) => {
  const photoRef = useRef<THREE.Group>(null);
  const candleLightRef = useRef<THREE.PointLight>(null);
  const textureLoader = useRef(new THREE.TextureLoader());
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);

  React.useEffect(() => {
    textureLoader.current.load(heroPhotoSrc, (t) => {
      setTexture(t);
    });
  }, [heroPhotoSrc]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (candleLightRef.current) {
      candleLightRef.current.intensity = 2.4 + 0.25 * Math.sin(time * 8);
    }

    if (photoRef.current) {
      if (['photo-lifting', 'living-memory', 'final-messages'].includes(stage)) {
        // Photo lifts into the air and floats towards the camera
        photoRef.current.position.y = THREE.MathUtils.lerp(photoRef.current.position.y, 2.2 + 0.08 * Math.sin(time * 2), 0.05);
        photoRef.current.position.z = THREE.MathUtils.lerp(photoRef.current.position.z, 2.0, 0.05);
        photoRef.current.rotation.x = THREE.MathUtils.lerp(photoRef.current.rotation.x, 0.15, 0.05);
        photoRef.current.rotation.y = THREE.MathUtils.lerp(photoRef.current.rotation.y, 0.05 * Math.sin(time * 1.5), 0.05);
      } else {
        // Resting on the desk with slight tilt
        photoRef.current.position.y = THREE.MathUtils.lerp(photoRef.current.position.y, -0.92, 0.08);
        photoRef.current.position.z = THREE.MathUtils.lerp(photoRef.current.position.z, 0, 0.08);
        photoRef.current.rotation.x = THREE.MathUtils.lerp(photoRef.current.rotation.x, -Math.PI / 2 + 0.08, 0.08);
        photoRef.current.rotation.z = THREE.MathUtils.lerp(photoRef.current.rotation.z, 0.12, 0.08);
      }
    }
  });

  return (
    <group>
      {/* Desk surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} />
      </mesh>

      {/* Candle */}
      <group position={[3.2, -0.75, -2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.22, 0.5, 32]} />
          <meshStandardMaterial color="#FDFBF7" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#FFB74D" />
        </mesh>
        <pointLight ref={candleLightRef} position={[0, 0.45, 0]} color="#FFA726" distance={6} />
      </group>

      {/* Hero 3D Polaroid */}
      <group
        ref={photoRef}
        position={[0, -0.92, 0]}
        rotation={[-Math.PI / 2 + 0.08, 0, 0.12]}
        onClick={(e) => {
          e.stopPropagation();
          onPhotoClick();
        }}
        onPointerOver={() => {
          if (stage === 'waiting-for-tap') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Polaroid frame */}
        <RoundedBox args={[2.4, 2.9, 0.04]} radius={0.03} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color="#FFFDF9" roughness={0.65} />
        </RoundedBox>

        {/* Photo texture plane */}
        {texture && (
          <mesh position={[0, 0.2, 0.022]}>
            <planeGeometry args={[2.0, 2.0]} />
            <meshStandardMaterial map={texture} roughness={0.4} />
          </mesh>
        )}

        {/* Polaroid caption strip */}
        <mesh position={[0, -1.05, 0.022]}>
          <planeGeometry args={[2.0, 0.3]} />
          <meshBasicMaterial color="#FFFDF9" />
        </mesh>
      </group>

      {/* Magical Living Memory Glowing Point Light */}
      {['living-memory', 'final-messages'].includes(stage) && (
        <pointLight position={[0, 2.5, 2.5]} color="#FCD5B5" intensity={1.5} distance={5} />
      )}
    </group>
  );
};
