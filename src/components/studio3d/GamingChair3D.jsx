import React from 'react';

export const GamingChair3D = ({ chair, team, onClick }) => {
  const isInferno = team === 'inferno';
  const accentColor = isInferno ? '#dc2626' : '#0284c7';
  const isUnlocked = chair.isUnlocked;
  const isOccupied = chair.isOccupied;

  return (
    <group position={chair.worldPos} rotation={[0, chair.worldRot, 0]} onClick={onClick}>
      {/* 1. Base 5-Star Castor Wheel Base */}
      <group position={[0, 0.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.28, 0.04, 5]} />
          <meshStandardMaterial color="#090a0f" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Hydraulic Piston Column */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.26, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* 5 Castor Wheels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 5;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.24, -0.02, Math.sin(angle) * 0.24]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#030712" />
            </mesh>
          );
        })}
      </group>

      {/* 2. Seat Cushion */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.09, 0.48]} />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>

      {/* 3. Ergonomic High Backrest */}
      <group position={[0, 0.8, -0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.48, 0.76, 0.08]} />
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </mesh>

        {/* Racing Side Bolsters */}
        <mesh position={[-0.22, 0, 0.04]} rotation={[0, 0.35, 0]}>
          <boxGeometry args={[0.08, 0.72, 0.06]} />
          <meshStandardMaterial color={accentColor} roughness={0.4} />
        </mesh>
        <mesh position={[0.22, 0, 0.04]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.08, 0.72, 0.06]} />
          <meshStandardMaterial color={accentColor} roughness={0.4} />
        </mesh>

        {/* Headrest Pillow with Golden Crown Emblem */}
        <mesh position={[0, 0.32, 0.05]}>
          <boxGeometry args={[0.32, 0.16, 0.05]} />
          <meshStandardMaterial color="#090a0f" roughness={0.4} />
        </mesh>
        {/* Golden Crown on Headrest */}
        <mesh position={[0, 0.32, 0.08]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.045, 0.05, 5]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Lumbar Support Pillow */}
        <mesh position={[0, -0.16, 0.04]}>
          <boxGeometry args={[0.3, 0.12, 0.04]} />
          <meshStandardMaterial color="#090a0f" />
        </mesh>
      </group>

      {/* 4. Armrests */}
      <mesh position={[-0.24, 0.54, -0.04]}>
        <boxGeometry args={[0.05, 0.03, 0.28]} />
        <meshStandardMaterial color="#090a0f" roughness={0.3} />
      </mesh>
      <mesh position={[0.24, 0.54, -0.04]}>
        <boxGeometry args={[0.05, 0.03, 0.28]} />
        <meshStandardMaterial color="#090a0f" roughness={0.3} />
      </mesh>

      {/* 5. Floor Unlock Status Ring */}
      {isUnlocked && (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.32, 0.42, 32]} />
            <meshBasicMaterial color="#10b981" opacity={0.9} transparent />
          </mesh>
        </group>
      )}
      {!isOccupied && !isUnlocked && (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.28, 0.36, 32]} />
            <meshBasicMaterial color="#f59e0b" opacity={0.8} transparent />
          </mesh>
        </group>
      )}
    </group>
  );
};
