'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CursorLight({ pointerRef }) {
  const lightRef = useRef();
  const coreRef = useRef();
  const haloRef = useRef();

  useFrame(() => {
    const { world, active } = pointerRef.current;
    const targetOpacity = active ? 1 : 0;

    // Hover the light a touch in front of the glass surface.
    const x = world.x;
    const y = world.y;
    const z = world.z + 0.55;

    if (lightRef.current) {
      lightRef.current.position.set(x, y, z);
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        active ? 6.5 : 0,
        0.15
      );
    }

    if (coreRef.current) {
      coreRef.current.position.set(x, y, z);
      coreRef.current.material.opacity = THREE.MathUtils.lerp(
        coreRef.current.material.opacity,
        targetOpacity * 0.95,
        0.15
      );
    }

    if (haloRef.current) {
      haloRef.current.position.set(x, y, z - 0.05);
      haloRef.current.material.opacity = THREE.MathUtils.lerp(
        haloRef.current.material.opacity,
        targetOpacity * 0.35,
        0.12
      );
      const s = 1 + Math.sin(performance.now() * 0.004) * 0.06;
      haloRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <pointLight
        ref={lightRef}
        color="#093fb4"
        intensity={0}
        distance={4.5}
        decay={2}
      />

      {/* Bright core — the "cursor" itself */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial
          color="#bfe0ff"
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      {/* Soft volumetric halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial
          color="#093fb4"
          transparent
          opacity={0}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
