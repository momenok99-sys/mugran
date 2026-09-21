'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FROST_ROUGHNESS = 0.92;
const CLEAR_ROUGHNESS = 0.06;
const REVEAL_RADIUS = 1.35; // world units — size of the "clear window"

export default function GlassMonolith({ pointerRef }) {
  const meshRef = useRef();
  const shaderRef = useRef(null);

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#eef4ff'),
      metalness: 0,
      roughness: FROST_ROUGHNESS,
      transmission: 1,
      thickness: 2.6,
      ior: 1.45,
      clearcoat: 0.4,
      clearcoatRoughness: 0.25,
      attenuationColor: new THREE.Color('#0a1f5c'),
      attenuationDistance: 2.2,
      envMapIntensity: 1.3,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // Inject a local "clear window" into the stock physical shader: roughness
    // is sampled per-fragment as a function of world-space distance from the
    // tracked pointer, so the frost melts away exactly under the cursor.
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uPointer = { value: new THREE.Vector3(0, 0, 10) };
      shader.uniforms.uRadius = { value: REVEAL_RADIUS };
      shader.uniforms.uFrost = { value: FROST_ROUGHNESS };
      shader.uniforms.uClear = { value: CLEAR_ROUGHNESS };
      shader.uniforms.uGlowColor = { value: new THREE.Color('#093fb4') };
      shader.uniforms.uActive = { value: 0 };

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        varying vec3 vWorldPos;`
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        varying vec3 vWorldPos;
        uniform vec3 uPointer;
        uniform float uRadius;
        uniform float uFrost;
        uniform float uClear;
        uniform vec3 uGlowColor;
        uniform float uActive;`
      );

      // Soft radial falloff — clear at the center of the cursor, frosted beyond it.
      shader.fragmentShader = shader.fragmentShader.replace(
        'float roughnessFactor = roughness;',
        `float distToPointer = length(vWorldPos - uPointer);
        float reveal = uActive * (1.0 - smoothstep(0.0, uRadius, distToPointer));
        reveal = pow(reveal, 1.4);
        float roughnessFactor = mix(uFrost, uClear, reveal);`
      );

      // A faint tech-blue bloom bleeds from the light into the glass itself.
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float glow = uActive * (1.0 - smoothstep(0.0, uRadius * 1.4, distToPointer));
        totalEmissiveRadiance += uGlowColor * glow * glow * 0.55;`
      );

      shaderRef.current = shader;
    };

    return mat;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Slow cinematic idle rotation — the portal is alive even when untouched.
      meshRef.current.rotation.y = Math.sin(performance.now() * 0.00008) * 0.06;
    }

    const shader = shaderRef.current;
    if (shader) {
      shader.uniforms.uPointer.value.copy(pointerRef.current.world);
      const targetActive = pointerRef.current.active ? 1 : 0;
      shader.uniforms.uActive.value +=
        (targetActive - shader.uniforms.uActive.value) * Math.min(delta * 6, 1);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} material={material} castShadow receiveShadow>
      <boxGeometry args={[2.8, 4.2, 1.2, 4, 4, 4]} />
    </mesh>
  );
}
