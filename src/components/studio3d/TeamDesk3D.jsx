import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createNameplateTexture, createTeamDeskDecal } from './textureGenerators.js';

// Ultra-Wide Esports Battle Monitor Component
const EsportsBattleMonitor = ({ team, index }) => {
  const isInferno = team === 'inferno';
  const accentColor = isInferno ? '#ef4444' : '#38bdf8';

  // Procedural screen texture showing game HUD / player camera
  const monitorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Dark screen background
    ctx.fillStyle = '#05070e';
    ctx.fillRect(0, 0, 512, 256);

    // Glowing border frame
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 496, 240);

    // Top status bar
    ctx.fillStyle = isInferno ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.25)';
    ctx.fillRect(12, 12, 488, 36);

    ctx.font = '800 20px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${isInferno ? 'INFERNO' : 'TITANS'} // STATION 0${index + 1}`, 24, 38);

    // Crosshairs & tactical match analytics display
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(256, 60);
    ctx.lineTo(256, 220);
    ctx.moveTo(100, 140);
    ctx.lineTo(412, 140);
    ctx.stroke();

    // Player Live Radar
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(256, 140, 6, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [team, index, accentColor]);

  return (
    <group position={[0, 0.24, -0.06]}>
      {/* Monitor Stand Base */}
      <mesh position={[0, 0, -0.05]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.015, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Stand Neck Arm */}
      <mesh position={[0, 0.12, -0.06]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.035, 0.24, 0.025]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Curved Ultra-Wide Monitor Display */}
      <group position={[0, 0.22, 0]}>
        {/* Back Bezel Chassis */}
        <mesh castShadow>
          <boxGeometry args={[0.54, 0.28, 0.025]} />
          <meshStandardMaterial color="#090a0f" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Rear Glowing RGB Accent Strip */}
        <mesh position={[0, 0, -0.015]}>
          <boxGeometry args={[0.52, 0.02, 0.005]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
        {/* Illuminated Curved Screen Face */}
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[0.52, 0.26]} />
          <meshBasicMaterial map={monitorTexture} />
        </mesh>
      </group>
    </group>
  );
};

// Inverted Glowing Neon Triangle / Chevron Floating Above Seat (as seen in image_af638eae.png)
const OverheadNeonChevron = ({ color }) => {
  return (
    <group position={[0, 2.3, 0]}>
      {/* Outer Triangle Outline */}
      <mesh rotation={[0, 0, Math.PI]}>
        <ringGeometry args={[0.15, 0.19, 3]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Soft Glow Core */}
      <mesh rotation={[0, 0, Math.PI]} position={[0, 0, -0.005]}>
        <ringGeometry args={[0.08, 0.22, 3]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export const TeamDesk3D = ({
  team,
  deskPosition,
  deskRotation,
  contestants,
  onBuzzerClick,
  onCallContestant,
}) => {
  const isInferno = team === 'inferno';
  const neonColor = isInferno ? '#f43f5e' : '#38bdf8';
  const deskTopColor = isInferno ? '#7f1d1d' : '#0369a1';

  const chairXOffsets = [-1.8, -0.9, 0, 0.9, 1.8];

  const nameplateTextures = useMemo(() => {
    return chairXOffsets.map((_, idx) => {
      const contestant = contestants[idx];
      const contestantName = contestant ? contestant.name : `Seat ${idx + 1}`;
      return createNameplateTexture(contestantName, team);
    });
  }, [contestants, team]);

  const frontDecalTexture = useMemo(() => {
    return createTeamDeskDecal(team);
  }, [team]);

  return (
    <group position={deskPosition} rotation={deskRotation}>
      {/* 1. DESK MAIN GEOMETRY */}
      <group position={[0, 0.46, 0]}>
        {/* Desk Top Curved Surface */}
        <mesh position={[0, 0.38, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.08, 0.9]} />
          <meshStandardMaterial
            color={deskTopColor}
            roughness={0.15}
            metalness={0.5}
          />
        </mesh>

        {/* Desk Glowing LED Trim Strip */}
        <mesh position={[0, 0.41, 0.54]}>
          <boxGeometry args={[4.84, 0.035, 0.035]} />
          <meshBasicMaterial color={neonColor} />
        </mesh>

        {/* Desk Front Slanted Panel */}
        <mesh position={[0, 0.02, 0.52]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[4.6, 0.68, 0.1]} />
          <meshStandardMaterial color="#090a10" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Front Panel Team Name & Logo Display (Crisp Decal) */}
        <mesh position={[0, 0.04, 0.58]} rotation={[-0.15, 0, 0]}>
          <planeGeometry args={[3.6, 0.52]} />
          <meshBasicMaterial
            map={frontDecalTexture}
            transparent
          />
        </mesh>

        {/* Outer Glow Frame for Desk Base */}
        <mesh position={[0, -0.32, 0.52]}>
          <boxGeometry args={[4.64, 0.04, 0.04]} />
          <meshBasicMaterial color={neonColor} />
        </mesh>

        {/* Ground Floor Shadow */}
        <mesh position={[0, -0.45, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.2, 1.4]} />
          <meshBasicMaterial color="#000000" opacity={0.65} transparent />
        </mesh>
      </group>

      {/* 2. FIVE INDIVIDUAL BATTLE STATIONS (MONITORS, MICS, BUZZERS, FLOATING CHEVRONS) */}
      {chairXOffsets.map((x, idx) => {
        const contestant = contestants[idx];
        const isBuzzed = contestant ? contestant.isBuzzed : false;

        return (
          <group key={idx} position={[x, 0.88, 0.35]}>
            {/* A. Esports Battle Monitor (as seen in image_f3501c33.png & image_af638eae.png) */}
            <EsportsBattleMonitor team={team} index={idx} />

            {/* B. Floating Neon Chevron Marker above Seat (from image_af638eae.png) */}
            <OverheadNeonChevron color={neonColor} />

            {/* C. Gooseneck Broadcast Desk Microphone */}
            <group position={[0.22, 0.02, 0.06]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.02, 0.025, 0.015, 12]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
              <mesh position={[-0.03, 0.08, 0.04]} rotation={[-0.4, 0.3, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.16, 8]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} />
              </mesh>
              <mesh position={[-0.06, 0.15, 0.07]}>
                <capsuleGeometry args={[0.01, 0.02, 4, 8]} />
                <meshStandardMaterial color="#090a0f" roughness={0.8} />
              </mesh>
            </group>

            {/* D. 3D Slanted Nameplate Banner */}
            <mesh
              position={[0, 0.04, 0]}
              rotation={[-0.3, 0, 0]}
              onClick={() => contestant && onCallContestant(contestant.id)}
            >
              <boxGeometry args={[0.62, 0.14, 0.02]} />
              <meshStandardMaterial
                color="#090a0f"
                emissive={neonColor}
                emissiveIntensity={0.3}
                roughness={0.2}
              />
            </mesh>

            {/* Crisp 3D Nameplate Textured Face */}
            <mesh
              position={[0, 0.04, 0.012]}
              rotation={[-0.3, 0, 0]}
              onClick={() => contestant && onCallContestant(contestant.id)}
            >
              <planeGeometry args={[0.58, 0.12]} />
              <meshBasicMaterial
                map={nameplateTextures[idx]}
                transparent
              />
            </mesh>

            {/* E. Individual Desk Buzzer Button */}
            <group
              position={[0, 0.05, 0.18]}
              onClick={(e) => {
                e.stopPropagation();
                if (contestant) {
                  onBuzzerClick(contestant.id);
                }
              }}
            >
              {/* Buzzer Chrome Base */}
              <mesh>
                <cylinderGeometry args={[0.07, 0.08, 0.02, 24]} />
                <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
              </mesh>
              {/* Buzzer Dome with Emissive Strike Glow */}
              <mesh position={[0, 0.02, 0]}>
                <sphereGeometry args={[0.05, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshStandardMaterial
                  color={isBuzzed ? '#fbbf24' : isInferno ? '#ef4444' : '#38bdf8'}
                  emissive={isBuzzed ? '#fbbf24' : isInferno ? '#dc2626' : '#0284c7'}
                  emissiveIntensity={isBuzzed ? 3.0 : 0.8}
                  roughness={0.1}
                />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};
