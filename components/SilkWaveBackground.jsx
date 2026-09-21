'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function SilkWaveBackground({ isHovered = false }) {
  const containerRef = useRef(null);
  const speedRef = useRef({ val: 1.0 });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // GSAP transition of animation playback speed on hover (1.0 -> 0.5 on hover, 0.5 -> 1.0 on leave)
  useEffect(() => {
    gsap.to(speedRef.current, {
      val: isHovered ? 0.45 : 1.0,
      duration: 1.2,
      ease: 'power3.out',
    });
  }, [isHovered]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf8fafc, 1);
    container.appendChild(renderer.domElement);

    // 2. Primary 3D Fluid Silk Ribbon Geometry
    const primaryGeo = new THREE.PlaneGeometry(18, 12, 160, 160);

    // Custom Vertex & Fragment Shader with Multi-Harmonic Wave Physics & Specular Sheen
    const primaryMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorNavy: { value: new THREE.Color('#0B1136') },
        uColorCobalt: { value: new THREE.Color('#2A4A9F') },
        uColorAzure: { value: new THREE.Color('#8AB4F8') },
        uColorHighlight: { value: new THREE.Color('#FFFFFF') },
        uColorBase: { value: new THREE.Color('#F8FAFC') },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Multi-octave organic diagonal fluid undulations
          float w1 = sin(pos.x * 0.65 - pos.y * 0.45 + uTime * 0.55) * 1.1;
          float w2 = cos(pos.x * 1.15 + pos.y * 0.85 + uTime * 0.35) * 0.55;
          float w3 = sin((pos.x * 1.6 + pos.y * 1.2) + uTime * 0.75) * 0.25;
          float w4 = cos((pos.x - pos.y) * 2.2 + uTime * 1.1) * 0.12;

          // Interactive mouse wave disturbance with spring inertia
          float dist = distance(pos.xy, uMouse * vec2(8.0, 5.0));
          float mouseDisturbance = sin(dist * 2.0 - uTime * 2.0) * exp(-dist * 0.45) * 0.4;

          float elevation = w1 + w2 + w3 + w4 + mouseDisturbance;
          pos.z += elevation;
          vElevation = elevation;

          vPosition = pos;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorNavy;
        uniform vec3 uColorCobalt;
        uniform vec3 uColorAzure;
        uniform vec3 uColorHighlight;
        uniform vec3 uColorBase;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vElevation;

        void main() {
          // Fresnel & Silk anisotropic sheen
          vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0) - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

          // Moving Light Specular Glint along the wave ridges
          vec3 lightDir = normalize(vec3(0.5, 0.8, 1.2));
          vec3 halfVector = normalize(lightDir + viewDir);
          float specular = pow(max(dot(vNormal, halfVector), 0.0), 32.0);

          // Diagonal and elevation-based color gradient
          float heightFactor = smoothstep(-1.2, 1.6, vElevation);
          float diagFactor = smoothstep(0.0, 1.0, vUv.x * 0.6 + vUv.y * 0.4);

          vec3 color = mix(uColorBase, uColorAzure, heightFactor * 0.55);
          color = mix(color, uColorCobalt, smoothstep(0.4, 0.95, heightFactor) * 0.7);
          color = mix(color, uColorNavy, smoothstep(0.75, 1.2, heightFactor) * 0.35);

          // Add silk luster & specular glint
          color += uColorHighlight * (fresnel * 0.8 + specular * 0.9);

          // Soft translucent alpha falloff towards boundaries
          float edgeAlpha = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                           smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
          float alpha = smoothstep(-2.0, 1.0, vElevation) * edgeAlpha * 0.88;

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const primaryMesh = new THREE.Mesh(primaryGeo, primaryMat);
    primaryMesh.rotation.z = -0.14;
    primaryMesh.rotation.x = 0.18;
    primaryMesh.position.set(0, 0.4, 0);
    scene.add(primaryMesh);

    // 3. Secondary Delicate Accent Silk Ribbon (for depth of field layering)
    const secondaryGeo = new THREE.PlaneGeometry(16, 8, 120, 120);
    const secondaryMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uColorCobalt: { value: new THREE.Color('#2A4A9F') },
        uColorHighlight: { value: new THREE.Color('#FFFFFF') },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float w1 = cos(pos.x * 0.8 + pos.y * 0.6 + uTime * 0.45) * 0.75;
          float w2 = sin(pos.x * 1.4 - pos.y * 0.9 + uTime * 0.65) * 0.35;
          pos.z += w1 + w2 - 0.8;

          vPosition = pos;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorCobalt;
        uniform vec3 uColorHighlight;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0) - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
          
          vec3 color = mix(uColorCobalt, uColorHighlight, fresnel * 0.85);
          float alpha = smoothstep(-1.8, 0.5, vPosition.z) * 0.35;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const secondaryMesh = new THREE.Mesh(secondaryGeo, secondaryMat);
    secondaryMesh.rotation.z = -0.08;
    secondaryMesh.position.set(0.5, -0.6, -1.2);
    scene.add(secondaryMesh);

    // 4. Floating Luminous Light Particles (Luxury Tech Atmosphere)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4 + 1.0;
      particleScales[i] = Math.random() * 0.6 + 0.4;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x8ab4f8,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. Mouse Move Handler with Spring Inertia
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 7. Master Animation Loop (60fps Fluid Dynamics)
    let time = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta * speedRef.current.val;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Update shader uniforms
      primaryMat.uniforms.uTime.value = time;
      primaryMat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      secondaryMat.uniforms.uTime.value = time;

      // Subtle dynamic mesh tilt and breathing motion
      primaryMesh.rotation.z = -0.14 + Math.sin(time * 0.25) * 0.02 + mouseRef.current.x * 0.04;
      primaryMesh.rotation.x = 0.18 + Math.cos(time * 0.2) * 0.02 + mouseRef.current.y * 0.04;

      secondaryMesh.rotation.z = -0.08 + Math.cos(time * 0.2) * 0.015;

      // Floating particles drift
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(time + i) * 0.002;
        positions[i * 3] += Math.cos(time * 0.5 + i) * 0.0015;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      primaryGeo.dispose();
      primaryMat.dispose();
      secondaryGeo.dispose();
      secondaryMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#F8FAFC',
      }}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Layered Silk Texture Accent with fluid breathing motion & subtle blend */}
      <div
        style={{
          position: 'absolute',
          inset: '-4%',
          backgroundImage: 'url(/hero-silk-wave.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.38,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          animation: 'silkFloatingBreathe 14s infinite ease-in-out alternate',
        }}
      />

      {/* High-Contrast Typographic Gradient Overlay (ensures #0B1136 text readability) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(248, 250, 252, 0.4) 0%, rgba(248, 250, 252, 0.1) 35%, rgba(248, 250, 252, 0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Cinematic Floating Breathing Keyframes */}
      <style jsx global>{`
        @keyframes silkFloatingBreathe {
          0% {
            transform: scale(1) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.03) translate3d(-10px, 8px, 0);
          }
          100% {
            transform: scale(1.01) translate3d(10px, -6px, 0);
          }
        }
      `}</style>
    </div>
  );
}
