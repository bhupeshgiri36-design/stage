import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Custom TV Broadcast Camera Velocity Motion Blur Shader
const TVBroadcastMotionBlurShader = {
  name: 'TVBroadcastMotionBlurShader',
  uniforms: {
    tDiffuse: { value: null },
    uVelocity: { value: new THREE.Vector2(0, 0) },
    uZoom: { value: 0.0 },
    uIntensity: { value: 1.0 },
    uResolution: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uVelocity;
    uniform float uZoom;
    uniform float uIntensity;
    uniform vec2 uResolution;
    varying vec2 vUv;

    const int SAMPLES = 10;

    void main() {
      vec2 vel = uVelocity * uIntensity;
      float velLen = length(vel);
      float absZoom = abs(uZoom);

      // Resting state: zero motion blur if stationary or very subtle drift
      if (velLen < 0.0006 && absZoom < 0.0006) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
      }

      // Television broadcast shutter angle clamp (natural optical shutter limit)
      float maxBlur = 0.038;
      if (velLen > maxBlur) {
        vel = (vel / velLen) * maxBlur;
        velLen = maxBlur;
      }

      vec2 zoomDir = (vUv - 0.5) * (uZoom * 0.03);
      vec2 totalStep = (vel + zoomDir) / float(SAMPLES - 1);

      vec4 color = vec4(0.0);
      float totalWeight = 0.0;

      // Broadcast TV optical lens chromatic dispersion on rapid whip-pans
      float chromatic = clamp(velLen * 0.18, 0.0, 0.006);

      for (int i = 0; i < SAMPLES; i++) {
        float factor = float(i) - float(SAMPLES - 1) * 0.5;
        vec2 offset = totalStep * factor;
        vec2 sampleUv = clamp(vUv + offset, vec2(0.001), vec2(0.999));

        // Center-weighted Gaussian/triangular curve
        float weight = 1.0 - (abs(factor) / float(SAMPLES)) * 0.65;

        // Multi-channel optical dispersion
        float r = texture2D(tDiffuse, clamp(sampleUv + offset * chromatic, vec2(0.001), vec2(0.999))).r;
        float g = texture2D(tDiffuse, sampleUv).g;
        float b = texture2D(tDiffuse, clamp(sampleUv - offset * chromatic, vec2(0.001), vec2(0.999))).b;
        float a = texture2D(tDiffuse, sampleUv).a;

        color += vec4(r, g, b, a) * weight;
        totalWeight += weight;
      }

      gl_FragColor = color / totalWeight;
    }
  `,
};

export const TVBroadcastMotionBlur = ({
  intensity = 1.0,
  enabled = true,
}) => {
  const { gl, scene, camera, size } = useThree();

  const composerRef = useRef(null);
  const blurPassRef = useRef(null);

  // Velocity tracking refs
  const prevPosRef = useRef(new THREE.Vector3());
  const prevQuatRef = useRef(new THREE.Quaternion());
  const prevEulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const currentVelocityRef = useRef(new THREE.Vector2(0, 0));
  const currentZoomRef = useRef(0);
  const isInitializedRef = useRef(false);

  // Initialize EffectComposer and passes
  useEffect(() => {
    // High-performance render target with linear filtering
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      colorSpace: THREE.SRGBColorSpace,
      stencilBuffer: false,
      depthBuffer: true,
    });

    const composer = new EffectComposer(gl, renderTarget);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const blurPass = new ShaderPass(TVBroadcastMotionBlurShader);
    blurPass.uniforms.uResolution.value.set(size.width, size.height);
    blurPass.uniforms.uIntensity.value = intensity;
    composer.addPass(blurPass);

    composerRef.current = composer;
    blurPassRef.current = blurPass;

    prevPosRef.current.copy(camera.position);
    prevQuatRef.current.copy(camera.quaternion);
    prevEulerRef.current.setFromQuaternion(camera.quaternion, 'YXZ');
    isInitializedRef.current = true;

    return () => {
      composer.dispose();
      renderTarget.dispose();
    };
  }, [gl, scene, camera, size.width, size.height, intensity]);

  // Handle resizing
  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height);
    }
    if (blurPassRef.current) {
      blurPassRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size.width, size.height]);

  // Priority 1 takes over R3F render loop
  useFrame((state, delta) => {
    if (!composerRef.current || !blurPassRef.current) return;

    if (!enabled) {
      composerRef.current.render(delta);
      return;
    }

    if (!isInitializedRef.current) {
      prevPosRef.current.copy(camera.position);
      prevQuatRef.current.copy(camera.quaternion);
      prevEulerRef.current.setFromQuaternion(camera.quaternion, 'YXZ');
      isInitializedRef.current = true;
      composerRef.current.render(delta);
      return;
    }

    // 1. Calculate Camera Positional Displacement in Local View Space
    const deltaPos = camera.position.clone().sub(prevPosRef.current);
    const localMove = deltaPos.applyQuaternion(camera.quaternion.clone().invert());

    // 2. Calculate Angular Displacement (Pan & Tilt)
    const currentEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    let deltaYaw = currentEuler.y - prevEulerRef.current.y;
    let deltaPitch = currentEuler.x - prevEulerRef.current.x;

    // Handle Euler wrapping (-PI to PI)
    if (deltaYaw > Math.PI) deltaYaw -= Math.PI * 2;
    if (deltaYaw < -Math.PI) deltaYaw += Math.PI * 2;
    if (deltaPitch > Math.PI) deltaPitch -= Math.PI * 2;
    if (deltaPitch < -Math.PI) deltaPitch -= Math.PI * 2;

    // 3. Compute Screen-Space Motion Blur Vector
    // Horizontal pan (yaw + strafe) -> X velocity
    // Vertical tilt (pitch + pedestal) -> Y velocity
    const targetVx = (-deltaYaw * 2.2 - localMove.x * 0.45);
    const targetVy = (deltaPitch * 2.2 - localMove.y * 0.45);
    const targetZoom = -localMove.z * 0.4;

    // Smoothly damp velocity over time to emulate television broadcast sensor persistence
    currentVelocityRef.current.x = THREE.MathUtils.damp(
      currentVelocityRef.current.x,
      targetVx,
      12,
      delta
    );
    currentVelocityRef.current.y = THREE.MathUtils.damp(
      currentVelocityRef.current.y,
      targetVy,
      12,
      delta
    );
    currentZoomRef.current = THREE.MathUtils.damp(
      currentZoomRef.current,
      targetZoom,
      10,
      delta
    );

    // Update Shader Uniforms
    blurPassRef.current.uniforms.uVelocity.value.copy(currentVelocityRef.current);
    blurPassRef.current.uniforms.uZoom.value = currentZoomRef.current;
    blurPassRef.current.uniforms.uIntensity.value = intensity;

    // Store state for next frame
    prevPosRef.current.copy(camera.position);
    prevQuatRef.current.copy(camera.quaternion);
    prevEulerRef.current.copy(currentEuler);

    // Render post-processing chain
    composerRef.current.render(delta);
  }, 1);

  return null;
};
