'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import PointerTracker from './scene/PointerTracker';
import CursorLight from './scene/CursorLight';

export default function MugranExperience() {
  // Shared, mutable, render-loop-only state. Kept out of React state so the
  // mouse can drive 60fps shader updates without ever triggering a re-render.
  const pointer = useRef({
    world: new THREE.Vector3(0, 0, 0.62),
    active: false,
  });

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      camera={{ position: [0, 0.3, 7.5], fov: 32 }}
      onCreated={({ gl }) => {
        gl.setClearColor('#000000', 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <PerformanceMonitor>
        <fog attach="fog" args={['#010939', 8, 16]} />

        <ambientLight intensity={0.15} color="#0b1a4a" />
        <directionalLight
          position={[4, 6, 5]}
          intensity={0.6}
          color="#a9c4ff"
        />
        <pointLight position={[-6, -2, -4]} intensity={4} color="#093fb4" />

        <Suspense fallback={null}>
          <Environment preset="night" environmentIntensity={0.8} />

          <PointerTracker pointerRef={pointer} planeZ={0.62} />
          <CursorLight pointerRef={pointer} />
        </Suspense>

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.35}
            mipmapBlur
            radius={0.7}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.65} />
        </EffectComposer>
      </PerformanceMonitor>
    </Canvas>
  );
}
