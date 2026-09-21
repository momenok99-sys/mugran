'use client';

import { useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const CREAM = '#fdfee9';
const BLUE = '#093fb4';

/**
 * A solid form with a thin, additive "rim" shell behind it — a cheap but
 * convincing edge-light trick that reads through the frosted glass as a
 * warm-cream / tech-blue halo around each icon's silhouette.
 */
function RimForm({ geometry, rimScale = 1.06, emissiveIntensity = 0.5 }) {
  return (
    <>
      <mesh geometry={geometry} renderOrder={1}>
        <meshStandardMaterial
          color="#0d1633"
          roughness={0.3}
          metalness={0.6}
          emissive={CREAM}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh geometry={geometry} scale={rimScale} renderOrder={0}>
        <meshBasicMaterial
          color={BLUE}
          transparent
          opacity={0.55}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

function FloatItem({ position, speed = 1, amplitude = 0.18, children }) {
  const bodyRef = useRef();
  const dragRef = useRef({ active: false, last: null, time: 0 });
  const { clock } = useThree();

  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.target.setPointerCapture(event.pointerId);
    const body = bodyRef.current;
    const translation = body.translation();

    dragRef.current = {
      active: true,
      last: new THREE.Vector3(event.point.x, event.point.y, translation.z),
      time: clock.elapsedTime,
    };
    body.wakeUp();
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    event.stopPropagation();
    const body = bodyRef.current;
    const now = clock.elapsedTime;
    const next = new THREE.Vector3(event.point.x, event.point.y, drag.last.z);
    const elapsed = Math.max(now - drag.time, 1 / 120);
    const velocity = next.clone().sub(drag.last).divideScalar(elapsed);

    body.setTranslation({ x: next.x, y: next.y, z: next.z }, true);
    body.setLinvel(
      { x: velocity.x, y: velocity.y, z: 0 },
      true
    );
    drag.last = next;
    drag.time = now;
  };

  const release = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    event.stopPropagation();
    event.target.releasePointerCapture(event.pointerId);
    drag.active = false;
    bodyRef.current.setLinvel(
      {
        x: THREE.MathUtils.clamp(bodyRef.current.linvel().x, -7, 7),
        y: THREE.MathUtils.clamp(bodyRef.current.linvel().y, -7, 7),
        z: 0,
      },
      true
    );
    document.body.style.cursor = '';
  };

  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      colliders="hull"
      mass={0.8}
      restitution={0.72}
      friction={0.35}
      linearDamping={0.18}
      angularDamping={0.2}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <group rotation={[0, 0, speed * 0.2]}>{children}</group>
    </RigidBody>
  );
}

function DeconstructedM({ scale = 1 }) {
  // Four separated slabs approximate an "M" — deliberately fragmented,
  // as if the letterform itself hasn't fully assembled yet.
  const beams = [
    { pos: [-0.32, 0, 0], rot: [0, 0, 0], size: [0.08, 0.6, 0.08] },
    { pos: [0.32, 0, 0], rot: [0, 0, 0], size: [0.08, 0.6, 0.08] },
    { pos: [-0.16, 0.08, 0.03], rot: [0, 0, 0.62], size: [0.07, 0.42, 0.07] },
    { pos: [0.16, 0.08, -0.03], rot: [0, 0, -0.62], size: [0.07, 0.42, 0.07] },
  ];
  return (
    <group scale={scale}>
      {beams.map((b, i) => (
        <group key={i} position={b.pos} rotation={b.rot}>
          <RimForm
            geometry={new THREE.BoxGeometry(...b.size)}
            emissiveIntensity={0.4}
          />
        </group>
      ))}
    </group>
  );
}

export default function FloatingIcons() {
  const sphereGeo = useMemo(() => new THREE.IcosahedronGeometry(0.34, 2), []);
  const torusGeo = useMemo(
    () => new THREE.TorusGeometry(0.32, 0.06, 20, 64),
    []
  );
  const pyramidGeo = useMemo(() => new THREE.ConeGeometry(0.36, 0.5, 4), []);

  return (
    <group position={[0, 0, 0]}>
      <FloatItem position={[-0.65, 0.9, -0.05]} speed={0.55} amplitude={0.15}>
        <RimForm geometry={sphereGeo} emissiveIntensity={0.35} />
      </FloatItem>

      <FloatItem position={[0.6, 0.35, 0.1]} speed={0.42} amplitude={0.2}>
        <RimForm geometry={torusGeo} emissiveIntensity={0.5} />
      </FloatItem>

      <FloatItem position={[-0.55, -0.6, 0.05]} speed={0.5} amplitude={0.17}>
        <RimForm geometry={pyramidGeo} emissiveIntensity={0.45} />
      </FloatItem>

      <FloatItem position={[0.4, -1.15, -0.05]} speed={0.38} amplitude={0.13}>
        <DeconstructedM scale={1.1} />
      </FloatItem>
    </group>
  );
}
