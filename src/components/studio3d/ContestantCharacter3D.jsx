import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStageStore } from '../../store/useStageStore.js';
import { createCharacterBadgeTexture } from './textureGenerators.js';

export const ContestantCharacter3D = ({ contestant }) => {
  const updateContestantMotion = useStageStore((s) => s.updateContestantMotion);

  const groupRef = useRef(null);
  const headRef = useRef(null);
  const chestRef = useRef(null);
  const leftLegRef = useRef(null);
  const rightLegRef = useRef(null);
  const leftArmRef = useRef(null);
  const rightArmRef = useRef(null);

  const isInferno = contestant.team === 'inferno';
  const jerseyColor = isInferno ? '#dc2626' : '#0284c7';
  const secondaryColor = isInferno ? '#991b1b' : '#0369a1';
  const accentColor = isInferno ? '#f59e0b' : '#38bdf8';
  const isBuzzed = contestant.isBuzzed;

  const isFemale =
    contestant.avatarId.includes('girl') ||
    contestant.name === 'Riya' ||
    contestant.name === 'Neha' ||
    contestant.name === 'Simran';
  const hairColor = isFemale ? '#2a1810' : '#111827';

  // Tick the walking motion loop in Zustand
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime() + (contestant.seatIndex || 0) * 1.5;

    // 1. Advance walking physics if in transit
    if (contestant.state === 'walking_to_podium' || contestant.state === 'walking_to_chair') {
      updateContestantMotion(contestant.id, delta);
    }

    // 2. Position and Rotation interpolation
    if (groupRef.current) {
      groupRef.current.position.set(
        contestant.currentPos[0],
        contestant.currentPos[1],
        contestant.currentPos[2]
      );
      groupRef.current.rotation.y = contestant.currentRot;
    }

    // 3. Chest Breathing Animation
    if (chestRef.current) {
      const breath = Math.sin(time * 2.6) * 0.02;
      chestRef.current.scale.set(1 + breath, 1 + breath * 0.4, 1 + breath);
    }

    // 4. Head Looking & Bobbing
    if (headRef.current) {
      if (contestant.state === 'at_podium') {
        headRef.current.rotation.y = Math.sin(time * 1.8) * 0.08;
      } else if (contestant.state === 'seated') {
        const centerLookBias = isInferno ? -0.2 : 0.2;
        headRef.current.rotation.y = THREE.MathUtils.lerp(
          headRef.current.rotation.y,
          centerLookBias + Math.sin(time * 1.2) * 0.08,
          0.05
        );
      }
    }

    // 5. Walking Rig Animation (Leg & Arm swing cycles)
    const isWalking =
      contestant.state === 'walking_to_podium' || contestant.state === 'walking_to_chair';

    if (isWalking) {
      const walkCycle = Math.sin(time * 7.5);
      if (leftLegRef.current) leftLegRef.current.rotation.x = walkCycle * 0.65;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * 0.65;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -walkCycle * 0.55;
      if (rightArmRef.current) rightArmRef.current.rotation.x = walkCycle * 0.55;
    } else if (contestant.state === 'seated') {
      // Seated pose: thighs horizontal, calves vertical
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.PI / 2;
      if (rightLegRef.current) rightLegRef.current.rotation.x = Math.PI / 2;

      // Arm resting on desk or slamming buzzer
      if (rightArmRef.current) {
        if (isBuzzed) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.45, 0.25);
        } else {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.9, 0.1);
        }
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.9, 0.1);
      }
    } else if (contestant.state === 'at_podium' || contestant.state === 'celebrating') {
      // Standing upright at podium
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;

      // Cheering / Waving
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -2.2 + Math.sin(time * 6) * 0.2;
        rightArmRef.current.rotation.z = -0.3;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.0;
        leftArmRef.current.rotation.z = 0.2;
      }
    }
  });

  const isStanding =
    contestant.state !== 'seated' && contestant.state !== 'sitting_down';

  const pelvisY = isStanding ? 0.82 : 0.44;

  const badgeTexture = useMemo(
    () =>
      createCharacterBadgeTexture(
        contestant.name,
        contestant.jerseyNumber,
        contestant.team,
        contestant.state === 'at_podium'
      ),
    [contestant.name, contestant.jerseyNumber, contestant.team, contestant.state]
  );

  return (
    <group ref={groupRef}>
      {/* 3D FLOATING NAME & STATUS BADGE ABOVE CHARACTER */}
      <sprite position={[0, isStanding ? 2.15 : 1.82, 0]} scale={[0.85, 0.28, 1]}>
        <spriteMaterial map={badgeTexture} depthWrite={false} transparent />
      </sprite>

      {/* LOWER BODY: Hips, Joggers & High-Top Sneakers */}
      <group position={[0, pelvisY, 0]}>
        {/* Pelvis / Waistband */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.13, 0.24]} />
          <meshStandardMaterial color="#090a0f" roughness={0.7} />
        </mesh>

        {/* LEFT LEG */}
        <group ref={leftLegRef} position={[-0.12, -0.06, 0]}>
          {/* Thigh (Dark slim jogger pants with team side stripe) */}
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.36, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          {/* Side Stripe on Outer Thigh */}
          <mesh position={[-0.07, -0.18, 0]}>
            <boxGeometry args={[0.015, 0.34, 0.03]} />
            <meshStandardMaterial color={accentColor} roughness={0.4} />
          </mesh>

          {/* Knee / Shin */}
          <group position={[0, -0.36, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.055, 0.36, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} />
            </mesh>
            {/* High-Top Esports Sneaker */}
            <group position={[0, -0.36, 0.06]}>
              {/* Sneaker Upper */}
              <mesh castShadow>
                <boxGeometry args={[0.11, 0.09, 0.24]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              {/* Colored Sneaker Accent & Heel Counter */}
              <mesh position={[0, 0.01, -0.06]}>
                <boxGeometry args={[0.115, 0.08, 0.1]} />
                <meshStandardMaterial color={jerseyColor} roughness={0.4} />
              </mesh>
              {/* Rubber Outsole */}
              <mesh position={[0, -0.045, 0]}>
                <boxGeometry args={[0.118, 0.02, 0.25]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>

        {/* RIGHT LEG */}
        <group ref={rightLegRef} position={[0.12, -0.06, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.36, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          <mesh position={[0.07, -0.18, 0]}>
            <boxGeometry args={[0.015, 0.34, 0.03]} />
            <meshStandardMaterial color={accentColor} roughness={0.4} />
          </mesh>

          <group position={[0, -0.36, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.055, 0.36, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} />
            </mesh>
            <group position={[0, -0.36, 0.06]}>
              <mesh castShadow>
                <boxGeometry args={[0.11, 0.09, 0.24]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.01, -0.06]}>
                <boxGeometry args={[0.115, 0.08, 0.1]} />
                <meshStandardMaterial color={jerseyColor} roughness={0.4} />
              </mesh>
              <mesh position={[0, -0.045, 0]}>
                <boxGeometry args={[0.118, 0.02, 0.25]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* UPPER BODY: Team Esports Zip-Up Hoodie / Jacket */}
      <group position={[0, pelvisY + 0.34, 0]}>
        {/* Main Chest with Team Color */}
        <mesh ref={chestRef} castShadow>
          <boxGeometry args={[0.46, 0.49, 0.26]} />
          <meshStandardMaterial color={jerseyColor} roughness={0.45} />
        </mesh>

        {/* Center Zipper Strip */}
        <mesh position={[0, 0, 0.132]}>
          <boxGeometry args={[0.02, 0.48, 0.005]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Athletic Contrast Shoulder Panels */}
        <mesh position={[-0.14, 0.14, 0.133]}>
          <boxGeometry args={[0.14, 0.15, 0.005]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.5} />
        </mesh>
        <mesh position={[0.14, 0.14, 0.133]}>
          <boxGeometry args={[0.14, 0.15, 0.005]} />
          <meshStandardMaterial color={secondaryColor} roughness={0.5} />
        </mesh>

        {/* Team Collar Trim */}
        <mesh position={[0, 0.21, 0.134]}>
          <boxGeometry args={[0.16, 0.08, 0.01]} />
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </mesh>

        {/* Golden Crown / Emblem Patch on Left Chest */}
        <mesh position={[-0.12, 0.08, 0.135]}>
          <boxGeometry args={[0.07, 0.07, 0.008]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.8}
            roughness={0.2}
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Dark Shoulders / Sleeve Caps */}
        <mesh position={[-0.24, 0.13, 0]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial color="#090a0f" roughness={0.6} />
        </mesh>
        <mesh position={[0.24, 0.13, 0]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial color="#090a0f" roughness={0.6} />
        </mesh>
      </group>

      {/* ARMS & HANDS */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.25, pelvisY + 0.44, 0]}>
        <mesh position={[0, -0.16, 0.1]} castShadow>
          <cylinderGeometry args={[0.06, 0.048, 0.38, 16]} />
          <meshStandardMaterial color={jerseyColor} roughness={0.5} />
        </mesh>
        {/* Athletic Cuff */}
        <mesh position={[0, -0.32, 0.16]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#090a0f" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.37, 0.18]}>
          <sphereGeometry args={[0.046, 14, 14]} />
          <meshStandardMaterial color="#f5c296" roughness={0.65} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.25, pelvisY + 0.44, 0]}>
        <mesh position={[0, -0.16, 0.1]} castShadow>
          <cylinderGeometry args={[0.06, 0.048, 0.38, 16]} />
          <meshStandardMaterial color={jerseyColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.32, 0.16]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#090a0f" />
        </mesh>
        <mesh position={[0, -0.37, 0.18]}>
          <sphereGeometry args={[0.046, 14, 14]} />
          <meshStandardMaterial color="#f5c296" roughness={0.65} />
        </mesh>
      </group>

      {/* HEAD, STYLED HAIR & ESPORTS BROADCAST HEADSET */}
      <group ref={headRef} position={[0, pelvisY + 0.72, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <cylinderGeometry args={[0.068, 0.075, 0.12, 16]} />
          <meshStandardMaterial color="#f5c296" roughness={0.65} />
        </mesh>

        {/* Head Base */}
        <mesh castShadow>
          <sphereGeometry args={[0.155, 22, 22]} />
          <meshStandardMaterial color="#f5c296" roughness={0.65} />
        </mesh>

        {/* Hair Styles */}
        {isFemale ? (
          <group>
            {/* Female Styled Ponytail / Volume */}
            <mesh position={[0, 0.09, -0.03]}>
              <sphereGeometry args={[0.168, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            {/* Side Hair Strands */}
            <mesh position={[-0.13, -0.08, 0.02]}>
              <cylinderGeometry args={[0.04, 0.03, 0.3, 12]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            <mesh position={[0.13, -0.08, 0.02]}>
              <cylinderGeometry args={[0.04, 0.03, 0.3, 12]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            {/* High Ponytail */}
            <mesh position={[0, 0.14, -0.15]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.03, 0.28, 12]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
          </group>
        ) : (
          <group>
            {/* Male Modern Undercut / Spikes */}
            <mesh position={[0, 0.09, -0.02]}>
              <sphereGeometry args={[0.165, 20, 20]} />
              <meshStandardMaterial color={hairColor} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.16, 0.03]}>
              <boxGeometry args={[0.16, 0.07, 0.16]} />
              <meshStandardMaterial color={hairColor} roughness={0.85} />
            </mesh>
          </group>
        )}

        {/* Expressive Eyes */}
        <mesh position={[-0.055, 0.02, 0.145]}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <meshStandardMaterial color="#090a0f" roughness={0.1} />
        </mesh>
        <mesh position={[0.055, 0.02, 0.145]}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <meshStandardMaterial color="#090a0f" roughness={0.1} />
        </mesh>

        {/* Eyebrows */}
        <mesh position={[-0.055, 0.045, 0.148]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.04, 0.01, 0.005]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
        <mesh position={[0.055, 0.045, 0.148]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.04, 0.01, 0.005]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>

        {/* Professional Esports Broadcast Headset */}
        <group>
          {/* Padded Headband */}
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.16, 0.016, 8, 28, Math.PI]} />
            <meshStandardMaterial color="#090a0f" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Left Illuminated Ear Cup */}
          <group position={[-0.165, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.044, 0.044, 0.032, 18]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} />
            {/* Team LED Ring on Ear Cup */}
            <mesh position={[0, -0.018, 0]}>
              <ringGeometry args={[0.025, 0.038, 16]} />
              <meshBasicMaterial color={isBuzzed ? '#fbbf24' : accentColor} />
            </mesh>
          </group>

          {/* Right Illuminated Ear Cup */}
          <group position={[0.165, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.044, 0.044, 0.032, 18]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} />
            <mesh position={[0, 0.018, 0]}>
              <ringGeometry args={[0.025, 0.038, 16]} />
              <meshBasicMaterial color={isBuzzed ? '#fbbf24' : accentColor} />
            </mesh>
          </group>

          {/* Flexible Boom Microphone */}
          <mesh position={[-0.14, -0.04, 0.1]} rotation={[0.38, -0.38, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.15, 8]} />
            <meshStandardMaterial color="#090a0f" metalness={0.8} />
          </mesh>
          {/* Glowing Mic Capsule */}
          <mesh position={[-0.08, -0.065, 0.16]}>
            <sphereGeometry args={[0.015, 10, 10]} />
            <meshStandardMaterial
              color={isBuzzed ? '#fbbf24' : '#ef4444'}
              emissive={isBuzzed ? '#fbbf24' : '#ef4444'}
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
