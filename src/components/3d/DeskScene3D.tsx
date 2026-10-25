'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface DeskScene3DProps {
  accentColor?: string;
}

export const DeskScene3D: React.FC<DeskScene3DProps> = ({ accentColor = '#D47A8F' }) => {
  const flameLightRef = useRef<THREE.PointLight>(null);

  // Scatter of cherry blossom petals
  const petals = useMemo(() => {
    const arr = [];
    const colors = [accentColor, '#ECC6CE', '#F9EBC5', '#B4CBB7'];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      arr.push({
        id: `petal_${i}`,
        pos: [-2.4 + 0.18 * Math.cos(angle), -0.98, -1.8 + 0.18 * Math.sin(angle)] as [number, number, number],
        color: colors[i % colors.length],
        scale: 0.07,
      });
    }
    arr.push({ id: 'p_center', pos: [-2.4, -0.97, -1.8] as [number, number, number], color: '#F7E5A9', scale: 0.05 });
    arr.push({ id: 'p1', pos: [-1.2, -0.99, -0.5] as [number, number, number], color: accentColor, scale: 0.04 });
    arr.push({ id: 'p2', pos: [1.8, -0.99, 0.6] as [number, number, number], color: accentColor, scale: 0.05 });
    arr.push({ id: 'p3', pos: [-0.6, -0.99, 1.2] as [number, number, number], color: '#F9EBC5', scale: 0.04 });
    return arr;
  }, [accentColor]);

  // Bracelet beads
  const beads = useMemo(() => {
    const arr = [];
    const colors = ['#F3A3B4', '#A2C2E1', '#F7E5A9', '#FFFDF9', '#B4CBB7'];
    for (let i = 0; i < 14; i++) {
      const angle = (i * Math.PI * 2) / 14;
      arr.push({
        id: `bead_${i}`,
        pos: [0.22 * Math.cos(angle), 0.03, 0.22 * Math.sin(angle)] as [number, number, number],
        color: colors[i % colors.length],
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (flameLightRef.current) {
      flameLightRef.current.intensity = 2.6 + 0.2 * Math.sin(7.5 * t);
    }
  });

  return (
    <group>
      {/* Desk Surface Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#F8F1E7" roughness={0.95} metalness={0.01} />
      </mesh>

      {/* Candle with flame light */}
      <group position={[3.5, -0.75, -2.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.2, 0.5, 32]} />
          <meshStandardMaterial color="#FFF9E6" roughness={0.65} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
          <meshBasicMaterial color="#1A1512" />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#FFB74D" />
        </mesh>
        <pointLight ref={flameLightRef} position={[0, 0.45, 0]} color="#FFA726" distance={4} />
      </group>

      {/* Coffee Mug */}
      <group position={[-3.5, -0.75, -2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.5, 24]} />
          <meshStandardMaterial color="#B4CBB7" roughness={0.5} />
        </mesh>
        <mesh position={[-0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.04, 8, 24]} />
          <meshStandardMaterial color="#B4CBB7" roughness={0.5} />
        </mesh>
      </group>

      {/* Pencil */}
      <group position={[-0.2, -0.97, -0.8]} rotation={[0, 0.8, Math.PI / 2 - 0.02]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.2, 12]} />
          <meshStandardMaterial color="#F7E5A9" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <coneGeometry args={[0.025, 0.08, 12]} />
          <meshStandardMaterial color="#EAD695" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <coneGeometry args={[0.01, 0.02, 12]} />
          <meshBasicMaterial color="#1A1512" />
        </mesh>
      </group>

      {/* Succulent Plant */}
      <group position={[-4.5, -0.8, -2.5]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.13, 0.4, 16]} />
          <meshStandardMaterial color="#DCCBB1" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.02, 16]} />
          <meshStandardMaterial color="#5C4033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.23, 0]} castShadow>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#B4CBB7" roughness={0.8} />
        </mesh>
        <mesh position={[0.07, 0.22, 0.04]} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#B4CBB7" roughness={0.8} />
        </mesh>
        <mesh position={[-0.07, 0.22, -0.04]} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#B4CBB7" roughness={0.8} />
        </mesh>
      </group>

      {/* Vintage Camera */}
      <group position={[-3.8, -0.75, 1.4]} rotation={[0, 0.45, 0]}>
        <RoundedBox args={[0.8, 0.52, 0.52]} radius={0.03} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color="#FFFDF9" roughness={0.6} />
        </RoundedBox>
        <mesh position={[0, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 24]} />
          <meshStandardMaterial color="#2C2520" roughness={0.4} />
        </mesh>
        <mesh position={[0.26, 0.18, 0.27]}>
          <boxGeometry args={[0.15, 0.1, 0.02]} />
          <meshStandardMaterial color="#EAEAEA" roughness={0.2} emissive="#FFFFFF" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Stack of Aesthetic Notebooks/Books */}
      <group position={[3.6, -0.92, -1]} rotation={[0, -0.25, 0]}>
        <RoundedBox args={[1.5, 0.16, 1.1]} radius={0.02} smoothness={3} position={[0, 0.08, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#B4CBB7" roughness={0.7} />
        </RoundedBox>
        <RoundedBox
          args={[1.3, 0.12, 1.0]}
          radius={0.02}
          smoothness={3}
          position={[0.05, 0.22, 0.05]}
          rotation={[0, 0.15, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#F3A3B4" roughness={0.7} />
        </RoundedBox>
      </group>

      {/* Washi Tape Rolls */}
      <group position={[1.8, -0.96, 1.4]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
          <meshStandardMaterial color="#F7E5A9" roughness={0.8} />
        </mesh>
        <mesh position={[0.04, 0.12, -0.02]} rotation={[0.1, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
          <meshStandardMaterial color="#ECC6CE" roughness={0.8} />
        </mesh>
      </group>

      {/* Friendship Bracelet */}
      <group position={[-2.2, -0.98, 0.8]}>
        {beads.map((b) => (
          <mesh key={b.id} position={b.pos} castShadow>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color={b.color} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Scattered Blossom Petals */}
      {petals.map((p) => (
        <mesh key={p.id} position={p.pos} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
          <planeGeometry args={[p.scale, p.scale * 1.3]} />
          <meshStandardMaterial color={p.color} roughness={0.85} side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Ambient & Directional Lighting for Desk */}
      <ambientLight intensity={0.85} color="#FCF8F2" />
      <directionalLight
        castShadow
        position={[4, 8, 4]}
        intensity={1.2}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
    </group>
  );
};
