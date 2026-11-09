import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStageStore } from '../../store/useStageStore.js';
import {
  createCentralScreenTexture,
  createInfernoBannerTexture,
  createTitansBannerTexture,
  createStageMarbleTexture,
  createPodiumCrownTexture,
  createPlayerTowerTexture,
} from './textureGenerators.js';

// Volumetric Spotlight Beam Component (creates real visible shafts of colored light cutting through studio air)
const VolumetricBeam = ({
  position,
  rotation,
  color,
  radius = 2.4,
  height = 9.0,
  opacity = 0.22,
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Outer soft glowing light cone */}
      <mesh position={[0, -height / 2, 0]}>
        <cylinderGeometry args={[0.2, radius, height, 24, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Inner bright core beam */}
      <mesh position={[0, -height / 2, 0]}>
        <cylinderGeometry args={[0.08, radius * 0.45, height, 20, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity * 0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export const StageEnvironment = () => {
  const currentScene = useStageStore((s) => s.currentScene);
  const activeQuestion = useStageStore((s) => s.activeQuestion);
  const infernoScore = useStageStore((s) => s.infernoScore);
  const titansScore = useStageStore((s) => s.titansScore);

  // Dynamic Central LED Screen Texture for current scene
  const centralScreenTexture = useMemo(() => {
    return createCentralScreenTexture(
      currentScene,
      activeQuestion,
      { inferno: infernoScore, titans: titansScore }
    );
  }, [currentScene, activeQuestion, infernoScore, titansScore]);

  const infernoBannerTexture = useMemo(() => createInfernoBannerTexture(), []);
  const titansBannerTexture = useMemo(() => createTitansBannerTexture(), []);
  const stageMarbleTexture = useMemo(() => createStageMarbleTexture(), []);
  const ceilingCrownTexture = useMemo(() => createPodiumCrownTexture(), []);

  // Vertical Player LED Towers Textures (as in image_af638eae.png)
  const infernoTowerTextures = useMemo(
    () => [
      createPlayerTowerTexture('inferno', 7, 'Kabir'),
      createPlayerTowerTexture('inferno', 18, 'Aman'),
      createPlayerTowerTexture('inferno', 23, 'Viral'),
      createPlayerTowerTexture('inferno', 9, 'Riya'),
      createPlayerTowerTexture('inferno', 11, 'Sahil'),
    ],
    []
  );

  const titansTowerTextures = useMemo(
    () => [
      createPlayerTowerTexture('titans', 10, 'Aryan'),
      createPlayerTowerTexture('titans', 44, 'Arhan'),
      createPlayerTowerTexture('titans', 33, 'Dev'),
      createPlayerTowerTexture('titans', 88, 'Nikhil'),
      createPlayerTowerTexture('titans', 99, 'Neha'),
    ],
    []
  );

  // Moving Spotlights references for dynamic sweeping animations
  const spot1Ref = useRef(null);
  const spot2Ref = useRef(null);
  const spot3Ref = useRef(null);
  const spot4Ref = useRef(null);
  const beamSweep1Ref = useRef(null);
  const beamSweep2Ref = useRef(null);
  const beamSweep3Ref = useRef(null);
  const beamSweep4Ref = useRef(null);

  const leftCameraRef = useRef(null);
  const rightCameraRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Dynamic Studio Spotlights sweeping the stage floor
    if (spot1Ref.current) {
      spot1Ref.current.position.x = -6 + Math.sin(t * 0.8) * 1.5;
      spot1Ref.current.target.position.x = Math.sin(t * 1.2) * 2;
      spot1Ref.current.target.updateMatrixWorld();
    }
    if (spot2Ref.current) {
      spot2Ref.current.position.x = 6 + Math.cos(t * 0.8) * 1.5;
      spot2Ref.current.target.position.x = -Math.cos(t * 1.2) * 2;
      spot2Ref.current.target.updateMatrixWorld();
    }
    if (spot3Ref.current) {
      spot3Ref.current.target.position.z = Math.sin(t * 0.9) * 2;
      spot3Ref.current.target.updateMatrixWorld();
    }
    if (spot4Ref.current) {
      spot4Ref.current.target.position.z = -Math.cos(t * 0.9) * 2;
      spot4Ref.current.target.updateMatrixWorld();
    }

    // Dynamic sweeping of volumetric beam cones in concert style!
    if (beamSweep1Ref.current) {
      beamSweep1Ref.current.rotation.z = Math.sin(t * 0.7) * 0.22 - 0.25;
      beamSweep1Ref.current.rotation.x = Math.cos(t * 0.5) * 0.15;
    }
    if (beamSweep2Ref.current) {
      beamSweep2Ref.current.rotation.z = -Math.sin(t * 0.7) * 0.22 + 0.25;
      beamSweep2Ref.current.rotation.x = Math.sin(t * 0.6) * 0.15;
    }
    if (beamSweep3Ref.current) {
      beamSweep3Ref.current.rotation.x = 0.2 + Math.sin(t * 0.9) * 0.18;
      beamSweep3Ref.current.rotation.z = Math.cos(t * 0.8) * 0.15;
    }
    if (beamSweep4Ref.current) {
      beamSweep4Ref.current.rotation.x = -0.2 - Math.sin(t * 0.9) * 0.18;
      beamSweep4Ref.current.rotation.z = -Math.cos(t * 0.8) * 0.15;
    }

    // 2. Automated Broadcast Cameras tracking stage motion
    if (leftCameraRef.current) {
      leftCameraRef.current.rotation.y = THREE.MathUtils.degToRad(-15) + Math.sin(t * 0.5) * 0.08;
    }
    if (rightCameraRef.current) {
      rightCameraRef.current.rotation.y = THREE.MathUtils.degToRad(15) - Math.cos(t * 0.5) * 0.08;
    }
  });

  return (
    <group>
      {/* 1. CIRCULAR HIGH-GLOSS STAGE FLOOR WITH CONCENTRIC NEON RINGS */}
      <group position={[0, -0.01, 0]}>
        {/* Main Circular Glossy Marble Floor */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[14, 14.5, 0.1, 64]} />
          <meshStandardMaterial
            map={stageMarbleTexture}
            roughness={0.12}
            metalness={0.75}
          />
        </mesh>

        {/* Outer Gold Concentric Neon Ring */}
        <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8.8, 9.15, 64]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>

        {/* Mid Red/Magenta Concentric Neon Ring */}
        <mesh position={[0, 0.053, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.6, 6.85, 64]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>

        {/* Inner Amber Stage Ring */}
        <mesh position={[0, 0.054, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.2, 4.45, 64]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>

        {/* Center Anchor Golden Orbit Ring */}
        <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.35, 64]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>

        {/* Radial Perspective Stage Stripes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <mesh
            key={deg}
            position={[0, 0.051, 0]}
            rotation={[-Math.PI / 2, 0, THREE.MathUtils.degToRad(deg)]}
          >
            <planeGeometry args={[0.06, 17.6]} />
            <meshBasicMaterial color="#fbbf24" opacity={0.35} transparent />
          </mesh>
        ))}

        {/* Floor Spotlight Pools / Discs underneath the colored beams */}
        {/* Central Golden Pool */}
        <mesh position={[0, 0.056, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.8, 32]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Team Inferno Red Pool */}
        <mesh position={[-4.5, 0.056, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.8, 32]} />
          <meshBasicMaterial
            color="#f43f5e"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Team Titans Cyan Pool */}
        <mesh position={[4.5, 0.056, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.8, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 2. MULTI-TIERED STEPPED ARENA STAGE WITH DUAL-COLOR NEON CONTOURS & PLAYER TOWERS */}
      {/* A. Central Elevated Riser & Stairs to Screen */}
      <group position={[0, 0, -4.6]}>
        <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
          <boxGeometry args={[11.5, 0.6, 3.4]} />
          <meshStandardMaterial color="#0c0e18" roughness={0.25} metalness={0.7} />
        </mesh>
        {/* Illuminated Edge Strip on Back Riser */}
        <mesh position={[0, 0.61, 1.7]}>
          <boxGeometry args={[11.52, 0.035, 0.04]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>

        {/* 5 Illuminated Golden Stairs Leading to Screen */}
        {[0, 1, 2, 3, 4].map((i) => {
          const stepY = i * 0.12 + 0.06;
          const stepZ = 1.6 - i * 0.32;
          const stepW = 4.8 - i * 0.3;
          return (
            <group key={i} position={[0, stepY, stepZ]}>
              <mesh receiveShadow>
                <boxGeometry args={[stepW, 0.12, 0.36]} />
                <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.05, 0.17]}>
                <boxGeometry args={[stepW + 0.04, 0.025, 0.02]} />
                <meshBasicMaterial color="#f59e0b" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* B. Team Inferno Raised Deck & Stepped Contour (Left Red Side as in image_f3501c33.png) */}
      <group position={[-4.5, 0, -0.6]} rotation={[0, 0.35, 0]}>
        {/* Raised Stage Deck under Inferno Desk */}
        <mesh position={[0, 0.14, 0.1]} receiveShadow castShadow>
          <boxGeometry args={[5.6, 0.28, 2.6]} />
          <meshStandardMaterial color="#0f111a" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Red Neon Edge Contour Ribbon */}
        <mesh position={[0, 0.282, 1.38]}>
          <boxGeometry args={[5.64, 0.04, 0.04]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[2.78, 0.282, 0.1]}>
          <boxGeometry args={[0.04, 0.04, 2.6]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        {/* 5 Vertical Player LED Towers Behind Inferno Desk (as in image_af638eae.png) */}
        {[-1.8, -0.9, 0, 0.9, 1.8].map((x, idx) => (
          <group key={idx} position={[x, 1.45, -1.15]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.72, 1.85, 0.06]} />
              <meshStandardMaterial color="#090a10" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Player Banner Display Face */}
            <mesh position={[0, 0, 0.032]}>
              <planeGeometry args={[0.68, 1.8]} />
              <meshBasicMaterial map={infernoTowerTextures[idx]} />
            </mesh>
            {/* Glowing Red Pillar Frame */}
            <mesh position={[0, 0, -0.01]}>
              <boxGeometry args={[0.74, 1.88, 0.05]} />
              <meshBasicMaterial color="#f43f5e" />
            </mesh>
          </group>
        ))}
      </group>

      {/* C. Team Titans Raised Deck & Stepped Contour (Right Blue Side as in image_f3501c33.png) */}
      <group position={[4.5, 0, -0.6]} rotation={[0, -0.35, 0]}>
        {/* Raised Stage Deck under Titans Desk */}
        <mesh position={[0, 0.14, 0.1]} receiveShadow castShadow>
          <boxGeometry args={[5.6, 0.28, 2.6]} />
          <meshStandardMaterial color="#0f111a" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Blue Neon Edge Contour Ribbon */}
        <mesh position={[0, 0.282, 1.38]}>
          <boxGeometry args={[5.64, 0.04, 0.04]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        <mesh position={[-2.78, 0.282, 0.1]}>
          <boxGeometry args={[0.04, 0.04, 2.6]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>

        {/* 5 Vertical Player LED Towers Behind Titans Desk (as in image_af638eae.png) */}
        {[-1.8, -0.9, 0, 0.9, 1.8].map((x, idx) => (
          <group key={idx} position={[x, 1.45, -1.15]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.72, 1.85, 0.06]} />
              <meshStandardMaterial color="#090a10" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Player Banner Display Face */}
            <mesh position={[0, 0, 0.032]}>
              <planeGeometry args={[0.68, 1.8]} />
              <meshBasicMaterial map={titansTowerTextures[idx]} />
            </mesh>
            {/* Glowing Blue Pillar Frame */}
            <mesh position={[0, 0, -0.01]}>
              <boxGeometry args={[0.74, 1.88, 0.05]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        ))}
      </group>

      {/* D. Center Thrust Apex Platform for Golden Podium (as in image_f3501c33.png) */}
      <group position={[0, 0, 1.4]}>
        <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.2, 2.4, 0.16, 48]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Golden Concentric Contour Ribbon on Apex Platform */}
        <mesh position={[0, 0.162, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.14, 2.22, 48]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[0, 0.163, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.36, 48]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* E. Cascading Stage Steps & Glowing Tier Contours connecting to floor (image_f3501c33.png) */}
      <group position={[0, 0, 0]}>
        {/* Mid-Tier Stepped Contour (Left Red / Right Cyan / Center White) */}
        <mesh position={[-4.5, 0.08, 1.1]} rotation={[-Math.PI / 2, 0, 0.35]}>
          <planeGeometry args={[5.2, 0.045]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[4.5, 0.08, 1.1]} rotation={[-Math.PI / 2, 0, -0.35]}>
          <planeGeometry args={[5.2, 0.045]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>

        {/* Lower-Tier Stepped Contour */}
        <mesh position={[-4.8, 0.04, 1.6]} rotation={[-Math.PI / 2, 0, 0.35]}>
          <planeGeometry args={[5.4, 0.045]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>
        <mesh position={[4.8, 0.04, 1.6]} rotation={[-Math.PI / 2, 0, -0.35]}>
          <planeGeometry args={[5.4, 0.045]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 3. GIANT CENTRAL CURVED LED SCREEN ON BACK WALL */}
      <group position={[0, 4.4, -6.6]}>
        <mesh receiveShadow>
          <cylinderGeometry
            args={[11, 11, 4.6, 48, 1, true, -Math.PI * 0.32, Math.PI * 0.64]}
          />
          <meshBasicMaterial
            map={centralScreenTexture}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh position={[0, 2.34, 0]}>
          <cylinderGeometry
            args={[11.04, 11.04, 0.08, 48, 1, true, -Math.PI * 0.32, Math.PI * 0.64]}
          />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -2.34, 0]}>
          <cylinderGeometry
            args={[11.04, 11.04, 0.08, 48, 1, true, -Math.PI * 0.32, Math.PI * 0.64]}
          />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 4. TWO SIDE SCREENS DISPLAYING TEAM LOGOS */}
      {/* Left Screen: Team Inferno */}
      <group position={[-8.2, 3.8, -3.2]} rotation={[0, 0.55, 0]}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[3.8, 4.6]} />
          <meshBasicMaterial map={infernoBannerTexture} />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[3.96, 4.76, 0.06]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Right Screen: Team Titans */}
      <group position={[8.2, 3.8, -3.2]} rotation={[0, -0.55, 0]}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[3.8, 4.6]} />
          <meshBasicMaterial map={titansBannerTexture} />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[3.96, 4.76, 0.06]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 5. CEILING LIGHTING TRUSSES & LARGE OVERHEAD SPOTLIGHTS */}
      <group position={[0, 8.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.8, 0.12, 8, 32]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.8, 0.14, 8, 32]} />
          <meshBasicMaterial color="#f59e0b" wireframe />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.2, 0.08, 8, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Floating Glowing Golden Crown in Ceiling Center (as seen in image_701a3d4f.png) */}
        <group position={[0, -0.1, 0]}>
          {/* Outer illuminated ceiling ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.7, 1.85, 32]} />
            <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
          </mesh>
          {/* Golden Crown Icon Mesh in Ceiling */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.2, 2.2]} />
            <meshBasicMaterial
              map={ceilingCrownTexture}
              transparent
              opacity={0.92}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        <mesh position={[0, 0.3, -2]}>
          <boxGeometry args={[18, 0.25, 0.25]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, 2]}>
          <boxGeometry args={[18, 0.25, 0.25]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>

        {/* 8 Studio Moving Head Spotlights mounted on Truss Ring */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = THREE.MathUtils.degToRad(deg);
          const x = Math.cos(rad) * 5.8;
          const z = Math.sin(rad) * 5.8;
          const lightColor =
            i % 4 === 0 ? '#fbbf24' : i % 4 === 1 ? '#f43f5e' : i % 4 === 2 ? '#38bdf8' : '#e879f9';

          return (
            <group key={deg} position={[x, -0.2, z]}>
              <mesh>
                <boxGeometry args={[0.32, 0.38, 0.32]} />
                <meshStandardMaterial color="#090a0f" roughness={0.3} />
              </mesh>
              {/* Glowing High-Power Lamp Lens */}
              <mesh position={[0, -0.18, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.04, 16]} />
                <meshBasicMaterial color={lightColor} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 6. REALISTIC THEATRICAL COLOUR SPOTLIGHTS & VOLUMETRIC LIGHT BEAMS */}
      {/* A. Central Anchor Host Golden Spotlight Beam */}
      <group position={[0, 8.2, 1.8]}>
        <VolumetricBeam
          position={[0, 0, 0]}
          rotation={[0.05, 0, 0]}
          color="#fbbf24"
          radius={2.1}
          height={8.2}
          opacity={0.3}
        />
      </group>

      {/* B. Team Inferno Fiery Red Spotlight Beam */}
      <group position={[-4.5, 8.2, -0.6]}>
        <VolumetricBeam
          position={[0, 0, 0]}
          rotation={[0.1, 0, -0.1]}
          color="#f43f5e"
          radius={3.2}
          height={8.2}
          opacity={0.28}
        />
      </group>

      {/* C. Team Titans Electric Cyan/Blue Spotlight Beam */}
      <group position={[4.5, 8.2, -0.6]}>
        <VolumetricBeam
          position={[0, 0, 0]}
          rotation={[0.1, 0, 0.1]}
          color="#38bdf8"
          radius={3.2}
          height={8.2}
          opacity={0.28}
        />
      </group>

      {/* D. Sweeping Concert Moving-Head Beams (Criss-Crossing Colors) */}
      <group ref={beamSweep1Ref} position={[-5.8, 8.2, 2.5]}>
        <VolumetricBeam
          position={[0, 0, 0]}
          rotation={[0, 0, -0.2]}
          color="#e11d48"
          radius={1.8}
          height={8.8}
          opacity={0.26}
        />
      </group>

      <group ref={beamSweep2Ref} position={[5.8, 8.2, 2.5]}>
        <VolumetricBeam
          position={[0, 0, 0]}
          rotation={[0, 0, 0.2]}
          color="#0284c7"
          radius={1.8}
          height={8.8}
          opacity={0.26}
        />
      </group>

      <group ref={beamSweep3Ref} position={[-2.5, 8.2, -3.5]}>
        <VolumetricBeam
          position={[0, 0, 0]}
          rotation={[0.2, 0, 0]}
          color="#c026d3"
          radius={1.9}
          height={8.8}
          opacity={0.24}
        />
      </group>

      <group ref={beamSweep4Ref} position={[2.5, 8.2, -3.5]}>
        <VolumetricBeam
          position={[0, 0, 0]}
          rotation={[0.2, 0, 0]}
          color="#f59e0b"
          radius={1.9}
          height={8.8}
          opacity={0.24}
        />
      </group>

      {/* 7. HARDWARE SPOTLIGHT SOURCES CASTING REAL 3D SHADOWS */}
      <spotLight
        ref={spot1Ref}
        position={[-6, 8.0, 3]}
        color="#f43f5e"
        intensity={3.8}
        angle={0.65}
        penumbra={0.65}
        castShadow
      />
      <spotLight
        ref={spot2Ref}
        position={[6, 8.0, 3]}
        color="#38bdf8"
        intensity={3.8}
        angle={0.65}
        penumbra={0.65}
        castShadow
      />
      <spotLight
        ref={spot3Ref}
        position={[0, 8.2, 3]}
        color="#fbbf24"
        intensity={4.2}
        angle={0.52}
        penumbra={0.5}
        castShadow
      />
      <spotLight
        ref={spot4Ref}
        position={[0, 8.0, -2.5]}
        color="#ffffff"
        intensity={2.2}
        angle={0.7}
        penumbra={0.8}
      />

      {/* 8. PROFESSIONAL BROADCAST ROBOT CAMERAS */}
      <group ref={leftCameraRef} position={[-5.8, 0, 5.2]}>
        <mesh position={[-0.2, 0.6, -0.2]} rotation={[0.15, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
        <mesh position={[0.2, 0.6, -0.2]} rotation={[0.15, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.6, 0.25]} rotation={[-0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>

        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.6, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        <group position={[0, 1.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.28, 0.6]} />
            <meshStandardMaterial color="#090a0f" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.09, 0.28, 24]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.18, -0.2]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.38, 0.22, 0.02]} />
            <meshStandardMaterial color="#030712" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.16, 0.18]}>
            <boxGeometry args={[0.08, 0.04, 0.04]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
          </mesh>
        </group>
      </group>

      <group ref={rightCameraRef} position={[5.8, 0, 5.2]}>
        <mesh position={[-0.2, 0.6, -0.2]} rotation={[0.15, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
        <mesh position={[0.2, 0.6, -0.2]} rotation={[0.15, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.6, 0.25]} rotation={[-0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </mesh>

        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.6, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        <group position={[0, 1.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.28, 0.6]} />
            <meshStandardMaterial color="#090a0f" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.09, 0.28, 24]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.18, -0.2]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.38, 0.22, 0.02]} />
            <meshStandardMaterial color="#030712" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.16, 0.18]}>
            <boxGeometry args={[0.08, 0.04, 0.04]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
          </mesh>
        </group>
      </group>

      {/* 9. RAKED ARENA STADIUM SEATING & MODERN SHELL CHAIRS (as seen in image_f3501c33.png) */}
      <group position={[0, 0, 0]}>
        {[
          { rowZ: 5.1, rowY: -0.12, riserH: 0.22, chairs: [-4.5, -3.6, -2.7, -1.8, -0.9, 0, 0.9, 1.8, 2.7, 3.6, 4.5] },
          { rowZ: 6.3, rowY: 0.16, riserH: 0.28, chairs: [-5.0, -4.0, -3.0, -2.0, -1.0, 0, 1.0, 2.0, 3.0, 4.0, 5.0] },
          { rowZ: 7.5, rowY: 0.44, riserH: 0.32, chairs: [-5.4, -4.4, -3.3, -2.2, -1.1, 0, 1.1, 2.2, 3.3, 4.4, 5.4] },
        ].map((tier, tierIdx) => (
          <group key={tierIdx} position={[0, tier.rowY, tier.rowZ]}>
            {/* Raked Concrete Stadium Riser Floor */}
            <mesh position={[0, -tier.riserH / 2, 0]} receiveShadow>
              <boxGeometry args={[13.5 + tierIdx * 1.5, tier.riserH, 1.15]} />
              <meshStandardMaterial color="#0b0f19" roughness={0.7} metalness={0.4} />
            </mesh>

            {/* Glowing Floor Edge Strip */}
            <mesh position={[0, 0.01, -0.56]}>
              <boxGeometry args={[13.6 + tierIdx * 1.5, 0.02, 0.02]} />
              <meshBasicMaterial color="#38bdf8" opacity={0.4} transparent />
            </mesh>

            {/* Modern Curved White Shell Stadium Chairs & Cheering Spectators */}
            {tier.chairs.map((x, cIdx) => {
              const isInfernoFan = x < -0.8;
              const isTitansFan = x > 0.8;
              const shirtColor = isInfernoFan
                ? cIdx % 2 === 0
                  ? '#dc2626'
                  : '#ea580c'
                : isTitansFan
                ? cIdx % 2 === 0
                  ? '#0284c7'
                  : '#2563eb'
                : cIdx % 2 === 0
                ? '#f8fafc'
                : '#1e293b';

              return (
                <group key={cIdx} position={[x, 0.02, 0]}>
                  {/* Modern Curved White Shell Stadium Chair (image_f3501c33.png) */}
                  {/* Chrome Base Pedestal */}
                  <mesh position={[0, 0.14, 0]}>
                    <cylinderGeometry args={[0.02, 0.025, 0.28, 8]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
                  </mesh>
                  {/* Curved White Seat Shell */}
                  <mesh position={[0, 0.28, 0]} castShadow>
                    <boxGeometry args={[0.38, 0.04, 0.36]} />
                    <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
                  </mesh>
                  {/* Ergonomic Curved Chair Back */}
                  <mesh position={[0, 0.44, 0.16]} rotation={[-0.1, 0, 0]} castShadow>
                    <boxGeometry args={[0.36, 0.32, 0.04]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
                  </mesh>

                  {/* Seated Spectator */}
                  <group position={[0, 0.32, 0.04]}>
                    {/* Torso with Fan Jersey */}
                    <mesh position={[0, 0.22, 0]} castShadow>
                      <boxGeometry args={[0.32, 0.34, 0.22]} />
                      <meshStandardMaterial color={shirtColor} roughness={0.6} />
                    </mesh>

                    {/* Head */}
                    <mesh position={[0, 0.46, -0.02]} castShadow>
                      <sphereGeometry args={[0.11, 14, 14]} />
                      <meshStandardMaterial color="#fbcfe8" roughness={0.7} />
                    </mesh>

                    {/* Stylized Hair */}
                    <mesh position={[0, 0.52, -0.04]}>
                      <sphereGeometry args={[0.115, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                      <meshStandardMaterial color="#0f172a" roughness={0.9} />
                    </mesh>

                    {/* Clapping / Cheering Arms */}
                    <mesh position={[-0.12, 0.28, -0.12]} rotation={[-0.6, 0.2, 0]}>
                      <cylinderGeometry args={[0.035, 0.04, 0.22, 8]} />
                      <meshStandardMaterial color={shirtColor} />
                    </mesh>
                    <mesh position={[0.12, 0.28, -0.12]} rotation={[-0.6, -0.2, 0]}>
                      <cylinderGeometry args={[0.035, 0.04, 0.22, 8]} />
                      <meshStandardMaterial color={shirtColor} />
                    </mesh>
                  </group>
                </group>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
};
