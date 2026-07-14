"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import type { OrbitControlsRef } from "./useCameraSail";

/** Where the camera settles once the visitor "enters" the archipelago: closer
 * and lower than the hero vantage (`[0, 6, 16]`, see `Canvas3D`), so the
 * chart reads as something to explore rather than admire from a distance. */
const EXPLORE_CAMERA_POS = new THREE.Vector3(0, 3.2, 8.5);
const EXPLORE_TARGET = new THREE.Vector3(0, 0, 0);
const EXPLORE_DURATION = 1.6;

/**
 * Eases the camera from the hero vantage into the closer exploring position
 * exactly once, the first time `exploring` becomes true (flipped by the
 * hero's "Enter the archipelago" CTA via `useExplore`/`ExploreProvider`).
 * Mirrors `useCameraSail`'s GSAP pattern: disables `OrbitControls` for the
 * tween's duration so it can't fight the camera by re-deriving position
 * from its own stale spherical state, then re-enables it (always enabled
 * afterward — explore mode is meant to unlock free orbiting).
 */
export function useExploreCamera(exploring: boolean, controlsRef?: OrbitControlsRef) {
  const { camera } = useThree();
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const mountedRef = useRef(true);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!exploring || hasEnteredRef.current) {
      return;
    }
    hasEnteredRef.current = true;

    const controls = controlsRef?.current ?? null;
    if (controls) {
      controls.enabled = false;
    }

    const startTarget = controls ? controls.target.clone() : new THREE.Vector3(0, 0, 0);
    const lookAt = startTarget.clone();
    const progress = { t: 0 };

    const tl = gsap.timeline({
      defaults: { duration: EXPLORE_DURATION, ease: "power2.inOut" },
      onComplete: () => {
        if (!mountedRef.current) {
          return;
        }
        if (controls) {
          controls.target.copy(EXPLORE_TARGET);
          controls.enabled = true;
          controls.update();
        }
        tlRef.current = null;
      },
    })
      .to(
        camera.position,
        { x: EXPLORE_CAMERA_POS.x, y: EXPLORE_CAMERA_POS.y, z: EXPLORE_CAMERA_POS.z },
        0,
      )
      .to(
        progress,
        {
          t: 1,
          onUpdate: () => {
            lookAt.copy(startTarget).lerp(EXPLORE_TARGET, progress.t);
            if (controls) {
              controls.target.copy(lookAt);
            }
            camera.lookAt(lookAt);
          },
        },
        0,
      );

    tlRef.current = tl;
  }, [exploring, camera, controlsRef]);
}
