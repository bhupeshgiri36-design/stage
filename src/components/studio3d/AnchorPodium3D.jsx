import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createPodiumCrownTexture } from './textureGenerators.js';

export const AnchorPodium3D = ({
  position = [0, 0, 1.4],
  onClick,
}) => {
  const crownMedallionTexture = useMemo(() => createPodiumCrownTexture(), []);

  return (
    <group position={position} onClick={onClick}>
      {/* 1. Stepped Circular Stage Tier Base */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[1.15, 1.25, 0.06, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.92}
          roughness={0.15}
        />
      </mesh>
      <mesh position={[0, 0.07, 0]} receiveShadow>
        <cylinderGeometry args={[1.02, 1.08, 0.04, 64]} />
        <meshStandardMaterial color="#090a10" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Concentric Glowing Amber Stage Ring on Base */}
      <mesh position={[0, 0.092, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.96, 1.04, 64]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* 2. Podium Body (Fluted Tapered Metallic Pillar matching images) */}
      <group position={[0, 0.58, 0]}>
        {/* Main Tapered Pedestal */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.56, 0.42, 0.94, 16]} />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.25}
            metalness={0.7}
          />
        </mesh>

        {/* Vertical Golden Fluted Accent Ribs around body */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = THREE.MathUtils.degToRad(deg);
          const topX = Math.sin(rad) * 0.565;
          const topZ = Math.cos(rad) * 0.565;
          return (
            <mesh key={deg} position={[topX * 0.9, 0, topZ * 0.9]} rotation={[0, rad, 0]}>
              <boxGeometry args={[0.02, 0.93, 0.04]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
          );
        })}

        {/* Front Golden Crown Emblem (Center Stage Signature medallion!) */}
        <mesh
          position={[0, 0.04, 0.48]}
          rotation={[-0.1, 0, 0]}
        >
          <circleGeometry args={[0.26, 32]} />
          <meshBasicMaterial map={crownMedallionTexture} />
        </mesh>

        {/* Gold Trim Ring at Base of Pedestal */}
        <mesh position={[0, -0.46, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.04, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Gold Trim Ring at Top of Pedestal */}
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.59, 0.59, 0.04, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* 3. Podium Top Golden Countertop with LED Lip */}
      <group position={[0, 1.08, 0]}>
        {/* Main Golden Countertop */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.72, 0.64, 0.08, 48]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.12}
            metalness={0.92}
          />
        </mesh>

        {/* Counter Inner Black Inset */}
        <mesh position={[0, 0.042, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.01, 48]} />
          <meshStandardMaterial color="#090a0f" roughness={0.4} />
        </mesh>

        {/* Glowing Amber LED Edge Ring */}
        <mesh position={[0, 0.043, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.62, 0.65, 48]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>

        {/* Broadcast Gooseneck Microphone */}
        <group position={[0, 0.05, 0.22]}>
          <mesh>
            <cylinderGeometry args={[0.026, 0.03, 0.02, 16]} />
            <meshStandardMaterial color="#090a0f" />
          </mesh>
          <mesh position={[0, 0.08, 0.03]} rotation={[-0.42, 0, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.16, 8]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.15, 0.07]}>
            <cylinderGeometry args={[0.014, 0.012, 0.04, 12]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0, 0.17, 0.07]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
