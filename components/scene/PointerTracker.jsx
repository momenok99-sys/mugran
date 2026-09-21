'use client';

import { useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Projects the 2D mouse position into 3D world space by intersecting the
 * camera ray with an invisible plane in front of the monolith. Writes the
 * result straight into a mutable ref so consumers (the glass shader, the
 * cursor light) can read it inside their own useFrame without React ever
 * re-rendering on mouse move.
 */
export default function PointerTracker({ pointerRef, planeZ = 1.05 }) {
  const { camera, pointer, gl } = useThree();

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), -planeZ),
    [planeZ]
  );
  const hit = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const dom = gl.domElement;
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    const onEnter = () => {
      pointerRef.current.active = true;
    };
    dom.addEventListener('pointerleave', onLeave);
    dom.addEventListener('pointerenter', onEnter);
    return () => {
      dom.removeEventListener('pointerleave', onLeave);
      dom.removeEventListener('pointerenter', onEnter);
    };
  }, [gl, pointerRef]);

  useFrame(() => {
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      // Smooth the tracked point slightly so the reveal glides rather than snaps.
      pointerRef.current.world.lerp(hit, 0.35);
    }
  });

  return null;
}
