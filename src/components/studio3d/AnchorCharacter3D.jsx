import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const AnchorCharacter3D = ({
  anchor,
  position = [0, 0.45, 0],
  onClick,
}) => {
  const groupRef = useRef(null);
  const spineRef = useRef(null);
  const headRef = useRef(null);
  const neckRef = useRef(null);
  const mouthRef = useRef(null);
  const rightShoulderRef = useRef(null);
  const rightArmRef = useRef(null);
  const rightForearmRef = useRef(null);
  const rightHandRef = useRef(null);
  const leftShoulderRef = useRef(null);
  const leftArmRef = useRef(null);
  const leftForearmRef = useRef(null);
  const leftHandRef = useRef(null);
  const chestRef = useRef(null);
  const micRef = useRef(null);

  // Smooth animation loop using delta-independent dampening
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const isSpeaking = anchor?.isSpeaking || false;
    const gesture = anchor?.gesture || (isSpeaking ? 'mic-raise' : 'idle');

    // 1. Natural Coordinated Body Idle (Spine breathing, hip sway, weight shifting)
    if (chestRef.current) {
      const breath = Math.sin(t * 2.2) * 0.025;
      chestRef.current.scale.set(1 + breath, 1 + breath * 0.5, 1 + breath);
    }

    if (spineRef.current) {
      // Natural subtle spine sway with weight transfer
      const swayZ = Math.sin(t * 1.1) * 0.025;
      const swayY = Math.sin(t * 0.7) * 0.035;
      spineRef.current.rotation.z = THREE.MathUtils.damp(spineRef.current.rotation.z, swayZ, 4, delta);
      spineRef.current.rotation.y = THREE.MathUtils.damp(spineRef.current.rotation.y, swayY, 4, delta);
    }

    // 2. Articulated Head & Neck Motion
    if (headRef.current && neckRef.current) {
      let targetHeadY = 0;
      let targetHeadX = Math.sin(t * 1.8) * 0.03;
      let targetHeadZ = 0;

      if (gesture === 'point-left') {
        targetHeadY = 0.42;
        targetHeadZ = -0.06;
      } else if (gesture === 'point-right') {
        targetHeadY = -0.42;
        targetHeadZ = 0.06;
      } else if (gesture === 'welcome') {
        targetHeadX = -0.08 + Math.sin(t * 2.5) * 0.04; // nodding enthusiastically
        targetHeadY = Math.sin(t * 1.2) * 0.08;
      } else if (isSpeaking) {
        // Expressive conversational head accents
        targetHeadX = -0.05 + Math.sin(t * 4.5) * 0.04;
        targetHeadY = Math.sin(t * 2.0) * 0.12;
      } else {
        targetHeadY = Math.sin(t * 0.9) * 0.08;
      }

      neckRef.current.rotation.y = THREE.MathUtils.damp(neckRef.current.rotation.y, targetHeadY * 0.4, 5, delta);
      headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, targetHeadY * 0.6, 5, delta);
      headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, targetHeadX, 6, delta);
      headRef.current.rotation.z = THREE.MathUtils.damp(headRef.current.rotation.z, targetHeadZ, 5, delta);
    }

    // 3. HD Realistic Mouth & Lip-Sync Animation
    if (mouthRef.current) {
      if (isSpeaking) {
        // Natural phonetic mouth cadence with varying syllable heights
        const mouthOpenY = 0.6 + Math.abs(Math.sin(t * 16)) * 0.8 + Math.abs(Math.cos(t * 9)) * 0.6;
        const mouthScaleX = 1 + Math.sin(t * 12) * 0.2;
        mouthRef.current.scale.set(mouthScaleX, mouthOpenY, 1);
      } else {
        mouthRef.current.scale.set(1, 0.2, 1);
      }
    }

    // 4. Right Arm & Hand (Mic Hold, Wave, Point)
    if (rightArmRef.current && rightForearmRef.current) {
      let rArmX = -0.55;
      let rArmZ = -0.32;
      let rForeX = -0.45;
      let rForeZ = 0.1;

      if (gesture === 'welcome') {
        // Grand open-arm greeting
        rArmX = -0.5 + Math.sin(t * 3.5) * 0.1;
        rArmZ = -0.95;
        rForeX = -0.35;
        rForeZ = -0.2;
      } else if (gesture === 'point-right') {
        rArmX = -0.25;
        rArmZ = -1.25;
        rForeX = -0.15;
        rForeZ = 0;
      } else if (isSpeaking || gesture === 'mic-raise') {
        // Broadcast Mic held right up to speaking level with natural micro-tremor
        rArmX = -1.05 + Math.sin(t * 5) * 0.02;
        rArmZ = -0.42;
        rForeX = -0.65;
        rForeZ = 0.2;
      } else {
        // Poised ready mic hold at chest level
        rArmX = -0.65 + Math.sin(t * 1.5) * 0.02;
        rArmZ = -0.32;
        rForeX = -0.45;
        rForeZ = 0.1;
      }

      rightArmRef.current.rotation.x = THREE.MathUtils.damp(rightArmRef.current.rotation.x, rArmX, 6, delta);
      rightArmRef.current.rotation.z = THREE.MathUtils.damp(rightArmRef.current.rotation.z, rArmZ, 6, delta);
      rightForearmRef.current.rotation.x = THREE.MathUtils.damp(rightForearmRef.current.rotation.x, rForeX, 6, delta);
      rightForearmRef.current.rotation.z = THREE.MathUtils.damp(rightForearmRef.current.rotation.z, rForeZ, 6, delta);
    }

    // 5. Left Arm & Hand (Relaxed Open Gesturing)
    if (leftArmRef.current && leftForearmRef.current) {
      let lArmX = 0.08;
      let lArmZ = 0.18;
      let lForeX = 0.05;

      if (gesture === 'welcome') {
        // Symmetrical open-arm wave
        lArmX = -0.5 + Math.cos(t * 3.5) * 0.1;
        lArmZ = 0.95;
        lForeX = -0.35;
      } else if (gesture === 'point-left') {
        lArmX = -0.25;
        lArmZ = 1.25;
        lForeX = -0.15;
      } else if (isSpeaking) {
        // Natural conversational left-hand cadence
        lArmX = -0.2 + Math.sin(t * 3.2) * 0.12;
        lArmZ = 0.32 + Math.cos(t * 2.8) * 0.08;
        lForeX = -0.35;
      } else {
        // Relaxed natural drape with subtle sway
        lArmX = 0.08 + Math.sin(t * 1.4) * 0.03;
        lArmZ = 0.18;
        lForeX = 0.06;
      }

      leftArmRef.current.rotation.x = THREE.MathUtils.damp(leftArmRef.current.rotation.x, lArmX, 6, delta);
      leftArmRef.current.rotation.z = THREE.MathUtils.damp(leftArmRef.current.rotation.z, lArmZ, 6, delta);
      leftForearmRef.current.rotation.x = THREE.MathUtils.damp(leftForearmRef.current.rotation.x, lForeX, 6, delta);
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* 1. LOWER BODY: Polished Formal Leather Shoes & Tailored Maroon Trousers */}
      {/* Left Shoe */}
      <group position={[-0.15, 0.05, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.09, 0.28]} />
          <meshStandardMaterial color="#090a0f" roughness={0.12} metalness={0.75} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.136, 0.02, 0.288]} />
          <meshStandardMaterial color="#1e1b18" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.01, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.062, 0.066, 0.06, 20]} />
          <meshStandardMaterial color="#090a0f" roughness={0.12} metalness={0.75} />
        </mesh>
      </group>

      {/* Right Shoe */}
      <group position={[0.15, 0.05, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.09, 0.28]} />
          <meshStandardMaterial color="#090a0f" roughness={0.12} metalness={0.75} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.136, 0.02, 0.288]} />
          <meshStandardMaterial color="#1e1b18" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.01, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.062, 0.066, 0.06, 20]} />
          <meshStandardMaterial color="#090a0f" roughness={0.12} metalness={0.75} />
        </mesh>
      </group>

      {/* Left Leg (Tailored Maroon Trousers with Front Crease) */}
      <mesh position={[-0.15, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.082, 0.07, 0.74, 24]} />
        <meshStandardMaterial color="#3b0918" roughness={0.6} />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.15, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.082, 0.07, 0.74, 24]} />
        <meshStandardMaterial color="#3b0918" roughness={0.6} />
      </mesh>

      {/* Pelvis & Leather Belt with Golden Buckle */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[0.45, 0.14, 0.26]} />
        <meshStandardMaterial color="#2d0512" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.82, 0.134]}>
        <boxGeometry args={[0.095, 0.068, 0.02]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.96} roughness={0.12} />
      </mesh>

      {/* 2. ARTICULATED SPINE & TORSO */}
      <group ref={spineRef} position={[0, 0.89, 0]}>
        {/* Upper Torso: Tailored Maroon Velvet Blazer */}
        <group position={[0, 0.27, 0]}>
          {/* Main Chest Structure */}
          <mesh ref={chestRef} castShadow>
            <boxGeometry args={[0.54, 0.56, 0.3]} />
            <meshStandardMaterial color="#590d22" roughness={0.42} metalness={0.15} />
          </mesh>

          {/* Black Silk Dress Shirt (Open at Collar) */}
          <mesh position={[0, 0.06, 0.153]}>
            <planeGeometry args={[0.18, 0.44]} />
            <meshStandardMaterial color="#090a0f" roughness={0.75} />
          </mesh>

          {/* Exposed Neck / Chest Skin */}
          <mesh position={[0, 0.21, 0.154]}>
            <planeGeometry args={[0.11, 0.13]} />
            <meshStandardMaterial color="#f5c296" roughness={0.6} />
          </mesh>

          {/* Gleaming Gold Cuban Link Chain Necklace */}
          <mesh position={[0, 0.19, 0.157]}>
            <torusGeometry args={[0.068, 0.01, 8, 36, Math.PI]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.08} />
          </mesh>

          {/* Peaked Left Lapel with Gold Piping */}
          <mesh position={[-0.14, 0.05, 0.159]} rotation={[0, 0, 0.13]}>
            <boxGeometry args={[0.12, 0.48, 0.018]} />
            <meshStandardMaterial color="#800f2f" roughness={0.3} metalness={0.3} />
          </mesh>
          <mesh position={[-0.085, 0.05, 0.169]} rotation={[0, 0, 0.13]}>
            <boxGeometry args={[0.012, 0.48, 0.006]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.96} roughness={0.12} />
          </mesh>

          {/* Peaked Right Lapel with Gold Piping */}
          <mesh position={[0.14, 0.05, 0.159]} rotation={[0, 0, -0.13]}>
            <boxGeometry args={[0.12, 0.48, 0.018]} />
            <meshStandardMaterial color="#800f2f" roughness={0.3} metalness={0.3} />
          </mesh>
          <mesh position={[0.085, 0.05, 0.169]} rotation={[0, 0, -0.13]}>
            <boxGeometry args={[0.012, 0.48, 0.006]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.96} roughness={0.12} />
          </mesh>

          {/* Satin Pocket Square in Breast Pocket */}
          <mesh position={[-0.18, 0.15, 0.156]}>
            <boxGeometry args={[0.07, 0.05, 0.012]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.88} roughness={0.18} />
          </mesh>

          {/* Double-Breasted Gold Buttons */}
          <mesh position={[0.04, 0.02, 0.158]}>
            <sphereGeometry args={[0.015, 14, 14]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.96} roughness={0.1} />
          </mesh>
          <mesh position={[0.04, -0.11, 0.158]}>
            <sphereGeometry args={[0.015, 14, 14]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.96} roughness={0.1} />
          </mesh>
          <mesh position={[-0.04, 0.02, 0.158]}>
            <sphereGeometry args={[0.015, 14, 14]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.96} roughness={0.1} />
          </mesh>
          <mesh position={[-0.04, -0.11, 0.158]}>
            <sphereGeometry args={[0.015, 14, 14]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.96} roughness={0.1} />
          </mesh>
        </group>

        {/* 3. MULTI-JOINTED ARMS & DETAILED HANDS */}
        {/* Left Arm with Gold Luxury Watch and Relaxed Gesturing Hand */}
        <group ref={leftShoulderRef} position={[-0.32, 0.46, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color="#590d22" roughness={0.42} />
          </mesh>

          <group ref={leftArmRef} position={[-0.04, -0.2, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.072, 0.062, 0.38, 20]} />
              <meshStandardMaterial color="#590d22" roughness={0.42} />
            </mesh>

            {/* Forearm */}
            <group ref={leftForearmRef} position={[-0.04, -0.3, 0.02]}>
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.062, 0.052, 0.34, 20]} />
                <meshStandardMaterial color="#590d22" roughness={0.42} />
              </mesh>

              {/* Gold Watch */}
              <mesh position={[0, -0.24, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.026, 20]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.96} roughness={0.12} />
              </mesh>

              {/* Hand with Sculpted Fingers */}
              <group ref={leftHandRef} position={[0, -0.32, 0]}>
                {/* Palm */}
                <mesh position={[0, -0.04, 0]}>
                  <boxGeometry args={[0.08, 0.08, 0.03]} />
                  <meshStandardMaterial color="#f5c296" roughness={0.6} />
                </mesh>
                {/* 4 Fingers */}
                {[-0.03, -0.01, 0.01, 0.03].map((fx, i) => (
                  <mesh key={i} position={[fx, -0.1, 0]}>
                    <cylinderGeometry args={[0.009, 0.008, 0.06, 8]} />
                    <meshStandardMaterial color="#f5c296" roughness={0.6} />
                  </mesh>
                ))}
                {/* Thumb */}
                <mesh position={[0.04, -0.04, 0.015]} rotation={[0, 0, -0.5]}>
                  <cylinderGeometry args={[0.01, 0.008, 0.05, 8]} />
                  <meshStandardMaterial color="#f5c296" roughness={0.6} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* Right Arm (Holding Television Microphone) */}
        <group ref={rightShoulderRef} position={[0.32, 0.46, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color="#590d22" roughness={0.42} />
          </mesh>

          <group ref={rightArmRef} position={[0.04, -0.2, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.072, 0.062, 0.38, 20]} />
              <meshStandardMaterial color="#590d22" roughness={0.42} />
            </mesh>

            {/* Forearm */}
            <group ref={rightForearmRef} position={[0.04, -0.3, 0.08]}>
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.062, 0.052, 0.34, 20]} />
                <meshStandardMaterial color="#590d22" roughness={0.42} />
              </mesh>

              {/* Hand Clasping Microphone */}
              <group ref={rightHandRef} position={[0, -0.28, 0.05]}>
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[0.054, 16, 16]} />
                  <meshStandardMaterial color="#f5c296" roughness={0.6} />
                </mesh>
                {/* Curled Fingers wrapping mic handle */}
                <mesh position={[-0.02, 0, 0.03]} rotation={[0, 0.3, 0]}>
                  <boxGeometry args={[0.03, 0.07, 0.04]} />
                  <meshStandardMaterial color="#f5c296" roughness={0.6} />
                </mesh>

                {/* 3D Professional Broadcast Television Microphone */}
                <group ref={micRef} position={[0, -0.02, 0.08]} rotation={[-0.2, 0, 0]}>
                  {/* Metal Handle */}
                  <mesh>
                    <cylinderGeometry args={[0.022, 0.018, 0.25, 20]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.82} roughness={0.2} />
                  </mesh>
                  {/* Gold Ring Trim */}
                  <mesh position={[0, 0.035, 0]}>
                    <cylinderGeometry args={[0.024, 0.024, 0.016, 20]} />
                    <meshStandardMaterial color="#fbbf24" metalness={0.96} roughness={0.1} />
                  </mesh>
                  {/* Glowing Red On-Air LED Ring */}
                  <mesh position={[0, 0.095, 0]}>
                    <cylinderGeometry args={[0.027, 0.027, 0.02, 20]} />
                    <meshStandardMaterial
                      color="#ef4444"
                      emissive="#ef4444"
                      emissiveIntensity={1.4}
                    />
                  </mesh>
                  {/* Golden Acoustic Capsule Grille */}
                  <mesh position={[0, 0.15, 0]}>
                    <sphereGeometry args={[0.04, 20, 20]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.94} roughness={0.18} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* 4. HIGH-FIDELITY SCULPTED HEAD & FACE WITH HAIR & AVIATORS */}
        <group ref={neckRef} position={[0, 0.62, 0]}>
          {/* Neck */}
          <mesh position={[0, -0.02, 0]} castShadow>
            <cylinderGeometry args={[0.078, 0.088, 0.16, 24]} />
            <meshStandardMaterial color="#f5c296" roughness={0.6} />
          </mesh>

          <group ref={headRef} position={[0, 0.12, 0]}>
            {/* Skull Base */}
            <mesh castShadow>
              <sphereGeometry args={[0.17, 28, 28]} />
              <meshStandardMaterial color="#f5c296" roughness={0.6} />
            </mesh>

            {/* Ears */}
            <mesh position={[-0.172, 0, 0]} rotation={[0, 0, 0.1]}>
              <boxGeometry args={[0.025, 0.07, 0.045]} />
              <meshStandardMaterial color="#f5c296" roughness={0.65} />
            </mesh>
            <mesh position={[0.172, 0, 0]} rotation={[0, 0, -0.1]}>
              <boxGeometry args={[0.025, 0.07, 0.045]} />
              <meshStandardMaterial color="#f5c296" roughness={0.65} />
            </mesh>

            {/* Styled Pompadour Hairstyle with Depth and Volume */}
            <mesh position={[0, 0.13, -0.02]}>
              <sphereGeometry args={[0.182, 28, 28]} />
              <meshStandardMaterial color="#111827" roughness={0.88} />
            </mesh>
            {/* Front Raised Quiff */}
            <mesh position={[0, 0.22, 0.05]} rotation={[-0.15, 0, 0]}>
              <boxGeometry args={[0.24, 0.11, 0.24]} />
              <meshStandardMaterial color="#111827" roughness={0.88} />
            </mesh>
            {/* Tapered Side Fade */}
            <mesh position={[-0.145, 0.06, 0]}>
              <boxGeometry args={[0.035, 0.13, 0.19]} />
              <meshStandardMaterial color="#1f2937" roughness={0.92} />
            </mesh>
            <mesh position={[0.145, 0.06, 0]}>
              <boxGeometry args={[0.035, 0.13, 0.19]} />
              <meshStandardMaterial color="#1f2937" roughness={0.92} />
            </mesh>

            {/* Groomed Beard along Jawline & Chin */}
            <mesh position={[0, -0.08, 0.1]}>
              <boxGeometry args={[0.22, 0.16, 0.16]} />
              <meshStandardMaterial color="#111827" roughness={0.92} />
            </mesh>
            {/* Mustache */}
            <mesh position={[0, -0.035, 0.166]}>
              <boxGeometry args={[0.14, 0.038, 0.022]} />
              <meshStandardMaterial color="#111827" roughness={0.92} />
            </mesh>

            {/* Animated Mouth (Speaking Aperture) */}
            <mesh ref={mouthRef} position={[0, -0.07, 0.174]}>
              <boxGeometry args={[0.075, 0.024, 0.015]} />
              <meshStandardMaterial color="#7f1d1d" roughness={0.4} />
            </mesh>

            {/* Iconic Designer Gold Aviator Sunglasses with Reflective Lenses */}
            <group position={[0, 0.05, 0.165]}>
              {/* Left Lens */}
              <mesh position={[-0.068, 0, 0]}>
                <boxGeometry args={[0.082, 0.048, 0.018]} />
                <meshStandardMaterial color="#030712" roughness={0.06} metalness={0.96} />
              </mesh>
              {/* Right Lens */}
              <mesh position={[0.068, 0, 0]}>
                <boxGeometry args={[0.082, 0.048, 0.018]} />
                <meshStandardMaterial color="#030712" roughness={0.06} metalness={0.96} />
              </mesh>
              {/* Gold Bridge */}
              <mesh position={[0, 0.014, 0.002]}>
                <boxGeometry args={[0.045, 0.012, 0.014]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.08} />
              </mesh>
              {/* Top Brow Bar */}
              <mesh position={[0, 0.026, 0.002]}>
                <boxGeometry args={[0.19, 0.009, 0.014]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.08} />
              </mesh>
              {/* Gold Temples to Ears */}
              <mesh position={[-0.135, 0, -0.09]} rotation={[0, -0.15, 0]}>
                <boxGeometry args={[0.008, 0.01, 0.18]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.08} />
              </mesh>
              <mesh position={[0.135, 0, -0.09]} rotation={[0, 0.15, 0]}>
                <boxGeometry args={[0.008, 0.01, 0.18]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.08} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
