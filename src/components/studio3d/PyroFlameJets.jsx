import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Single Pyro Flame Cannon Nozzle with Animated Fire Plume
const FlameJet = ({ position, color = '#f97316', secondaryColor = '#facc15', pulsePhase = 0 }) => {
  const plumeRef = useRef(null);
  const coreRef = useRef(null);
  const lightRef = useRef(null);
  const baseGlowRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 3.5 + pulsePhase;
    
    // Rhythmic stage pyro burst pattern (erupts every ~3 seconds with jitter)
    const cycle = Math.sin(t * 0.8);
    const isErupting = cycle > 0.1;
    const baseScale = isErupting ? 0.85 + Math.sin(t * 12) * 0.25 : 0.08;

    if (plumeRef.current) {
      plumeRef.current.scale.set(baseScale, baseScale * (1.2 + Math.cos(t * 15) * 0.3), baseScale);
      plumeRef.current.rotation.y = t * 2.0;
    }
    if (coreRef.current) {
      coreRef.current.scale.set(baseScale * 0.55, baseScale * (1.1 + Math.sin(t * 18) * 0.2), baseScale * 0.55);
    }
    if (lightRef.current) {
      lightRef.current.intensity = isErupting ? 2.5 + Math.random() * 1.5 : 0.15;
    }
    if (baseGlowRef.current) {
      baseGlowRef.current.scale.setScalar(isErupting ? 1.0 : 0.3);
    }
  });

  return (
    <group position={position}>
      {/* 1. Heavy Stage Flame Nozzle Canister */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.14, 0.16, 16]} />
        <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Chrome Top Rim */}
      <mesh position={[0, 0.165, 0]}>
        <cylinderGeometry args={[0.115, 0.115, 0.015, 16]} />
        <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* 2. Outer Fire Plume (Additive Blending) */}
      <mesh ref={plumeRef} position={[0, 0.8, 0]}>
        <coneGeometry args={[0.32, 1.4, 16, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Inner White-Hot Flame Core */}
      <mesh ref={coreRef} position={[0, 0.7, 0]}>
        <coneGeometry args={[0.18, 1.2, 12, 1, true]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Base Ignite Flame Disc */}
      <mesh ref={baseGlowRef} position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 16]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 5. Dynamic Fire Glow Light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.9, 0]}
        color={secondaryColor}
        distance={4.5}
        intensity={1.5}
      />
    </group>
  );
};

export const PyroFlameJets = () => {
  return (
    <group>
      {/* Inferno Side Stage Flames (as seen in image_af638eae.png) */}
      <FlameJet position={[-3.2, 0.32, 0.6]} color="#ef4444" secondaryColor="#fbbf24" pulsePhase={0} />
      <FlameJet position={[-1.7, 0.32, 1.0]} color="#f97316" secondaryColor="#fef08a" pulsePhase={1.5} />

      {/* Titans Side Stage Flames (as seen in image_af638eae.png) */}
      <FlameJet position={[1.7, 0.32, 1.0]} color="#f97316" secondaryColor="#fef08a" pulsePhase={0.8} />
      <FlameJet position={[3.2, 0.32, 0.6]} color="#38bdf8" secondaryColor="#fef08a" pulsePhase={2.3} />
    </group>
  );
};
