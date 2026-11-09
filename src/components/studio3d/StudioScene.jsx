import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useStageStore } from '../../store/useStageStore.js';
import { StageEnvironment } from './StageEnvironment.jsx';
import { TeamDesk3D } from './TeamDesk3D.jsx';
import { GamingChair3D } from './GamingChair3D.jsx';
import { ContestantCharacter3D } from './ContestantCharacter3D.jsx';
import { AnchorPodium3D } from './AnchorPodium3D.jsx';
import { AnchorCharacter3D } from './AnchorCharacter3D.jsx';
import { TVBroadcastMotionBlur } from './TVBroadcastMotionBlur.jsx';
import { PyroFlameJets } from './PyroFlameJets.jsx';

// Studio Environment Generator for photorealistic PBR metallic and gloss reflections
const StudioEnvironmentReflection = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    // Generate zero-dependency procedural studio environment map
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;

    // Set cinematic ACESFilmic tone mapping
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.18;
    scene.fog = new THREE.FogExp2('#030408', 0.012);

    pmremGenerator.dispose();
    roomEnv.dispose();

    return () => {
      envTexture.dispose();
    };
  }, [gl, scene]);

  return null;
};

// Camera Director that smoothly interpolates between all 7 cameras with TV broadcast whip dynamics
const CameraDirector = () => {
  const { camera } = useThree();
  const controlsRef = useRef(null);

  const currentCamera = useStageStore((s) => s.currentCamera);
  const trackingTargetPos = useStageStore((s) => s.trackingTargetPos);
  const orbitAngle = useStageStore((s) => s.orbitAngle);
  const updateOrbitAngle = useStageStore((s) => s.updateOrbitAngle);

  // Exact broadcast perspective presets matching reality show broadcast
  const cameraPresets = {
    // Primary Broadcast Hero Angle matching the reference screenshot
    cam1_wide: { pos: new THREE.Vector3(0, 2.35, 7.2), look: new THREE.Vector3(0, 1.4, -0.3) },
    cam2_anchor: { pos: new THREE.Vector3(0, 1.65, 3.4), look: new THREE.Vector3(0, 1.48, 1.4) },
    cam3_inferno: { pos: new THREE.Vector3(-3.8, 1.9, 2.6), look: new THREE.Vector3(-4.5, 1.15, -0.6) },
    cam4_titans: { pos: new THREE.Vector3(3.8, 1.9, 2.6), look: new THREE.Vector3(4.5, 1.15, -0.6) },
    cam6_topdown: { pos: new THREE.Vector3(0, 13.0, 0.1), look: new THREE.Vector3(0, 0, 0) },
  };

  useFrame((_, delta) => {
    let targetPos = new THREE.Vector3(0, 2.05, 6.8);
    let targetLook = new THREE.Vector3(0, 1.42, 0);

    if (currentCamera === 'cam5_tracking') {
      const tX = trackingTargetPos[0];
      const tY = trackingTargetPos[1];
      const tZ = trackingTargetPos[2];
      targetPos = new THREE.Vector3(tX * 0.7, tY + 1.2, tZ + 3.2);
      targetLook = new THREE.Vector3(tX, tY + 0.3, tZ);
    } else if (currentCamera === 'cam7_orbit') {
      updateOrbitAngle(delta * 0.32);
      const radius = 8.2;
      const oX = Math.sin(orbitAngle) * radius;
      const oZ = Math.cos(orbitAngle) * radius;
      targetPos = new THREE.Vector3(oX, 3.0, oZ);
      targetLook = new THREE.Vector3(0, 1.2, 0);
    } else {
      const preset = cameraPresets[currentCamera] || cameraPresets.cam1_wide;
      targetPos = preset.pos;
      targetLook = preset.look;
    }

    // Smooth TV Broadcast Jib/Crane Lerp Camera Position (induces authentic broadcast motion blur)
    camera.position.lerp(targetPos, 0.068);

    // Smooth Lerp Controls Target
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook, 0.068);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      maxPolarAngle={Math.PI / 2 - 0.04}
      minDistance={2.2}
      maxDistance={20}
      dampingFactor={0.08}
    />
  );
};

export const StudioScene = () => {
  const anchor = useStageStore((s) => s.anchor);
  const chairs = useStageStore((s) => s.chairs);
  const contestants = useStageStore((s) => s.contestants);
  const triggerBuzzer = useStageStore((s) => s.triggerBuzzer);
  const callContestantToPodium = useStageStore((s) => s.callContestantToPodium);
  const setAnchorDialogue = useStageStore((s) => s.setAnchorDialogue);
  const isMotionBlurEnabled = useStageStore((s) => s.isMotionBlurEnabled);
  const motionBlurIntensity = useStageStore((s) => s.motionBlurIntensity);

  const infernoChairs = chairs.filter((c) => c.team === 'inferno');
  const titansChairs = chairs.filter((c) => c.team === 'titans');

  const infernoContestants = Object.values(contestants).filter((c) => c.team === 'inferno');
  const titansContestants = Object.values(contestants).filter((c) => c.team === 'titans');

  return (
    <div className="relative w-full h-full bg-[#030408]">
      <Canvas
        shadows
        camera={{ position: [0, 2.05, 6.8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#030408']} />

        {/* 1. Procedural PBR Studio Environment Map */}
        <StudioEnvironmentReflection />

        {/* 2. Three-Point Studio Lighting Rig */}
        {/* Cool Sky / Warm Ground Hemisphere fill */}
        <hemisphereLight
          args={['#38bdf8', '#f59e0b', 0.45]}
        />
        <ambientLight intensity={0.4} color="#e2e8f0" />

        {/* Directional Key Light from Truss */}
        <directionalLight
          position={[0, 9.5, 7.5]}
          intensity={1.35}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-bias={-0.0004}
        />

        {/* Theatrical Team Rim / Fill Lights */}
        <pointLight position={[-7.5, 4.2, 0]} intensity={1.8} color="#f43f5e" distance={16} />
        <pointLight position={[7.5, 4.2, 0]} intensity={1.8} color="#38bdf8" distance={16} />
        <pointLight position={[0, 3.2, 2.2]} intensity={2.4} color="#fbbf24" distance={12} />

        {/* 3. Camera Director with OrbitControls */}
        <CameraDirector />

        {/* 4. Post-Processing TV Broadcast Motion Blur */}
        <TVBroadcastMotionBlur
          enabled={isMotionBlurEnabled}
          intensity={motionBlurIntensity}
        />

        {/* 5. COMPLETE 3D ARENA STAGE ENVIRONMENT */}
        <StageEnvironment />

        {/* Theatrical Stage Pyrotechnic Flame Jets (as seen in image_af638eae.png) */}
        <PyroFlameJets />

        {/* 6. TEAM INFERNO (LEFT CURVED RED DESK & 5 GAMING CHAIRS) */}
        <TeamDesk3D
          team="inferno"
          deskPosition={[-4.5, 0, -0.6]}
          deskRotation={[0, 0.35, 0]}
          contestants={infernoContestants}
          onBuzzerClick={triggerBuzzer}
          onCallContestant={callContestantToPodium}
        />
        {infernoChairs.map((chair) => (
          <GamingChair3D
            key={chair.id}
            chair={chair}
            team="inferno"
            onClick={() => {
              if (chair.contestantId) {
                callContestantToPodium(chair.contestantId);
              }
            }}
          />
        ))}

        {/* 7. TEAM TITANS (RIGHT CURVED BLUE DESK & 5 GAMING CHAIRS) */}
        <TeamDesk3D
          team="titans"
          deskPosition={[4.5, 0, -0.6]}
          deskRotation={[0, -0.35, 0]}
          contestants={titansContestants}
          onBuzzerClick={triggerBuzzer}
          onCallContestant={callContestantToPodium}
        />
        {titansChairs.map((chair) => (
          <GamingChair3D
            key={chair.id}
            chair={chair}
            team="titans"
            onClick={() => {
              if (chair.contestantId) {
                callContestantToPodium(chair.contestantId);
              }
            }}
          />
        ))}

        {/* 8. INDEPENDENT MOVING CONTESTANTS */}
        {Object.values(contestants).map((contestant) => (
          <ContestantCharacter3D
            key={contestant.id}
            contestant={contestant}
          />
        ))}

        {/* 9. CENTRAL ANCHOR GOLDEN PODIUM (Fluted with 3D Crown Medallion) */}
        <AnchorPodium3D
          position={[0, 0, 1.4]}
          onClick={() =>
            setAnchorDialogue(
              'Hello everyone! Welcome to Champions Tera Bhai! Today we make history on center stage!',
              'welcome'
            )
          }
        />

        {/* 10. CENTRAL ANCHOR 3D AVATAR (Interactive Speech Trigger) */}
        <AnchorCharacter3D
          anchor={anchor}
          position={[0, 0, 1.8]}
          onClick={() =>
            setAnchorDialogue(
              'Hello everyone! Welcome to Champions Tera Bhai! Today we make history on center stage!',
              'welcome'
            )
          }
        />
      </Canvas>
    </div>
  );
};
