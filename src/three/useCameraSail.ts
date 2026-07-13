"use client";

import { useCallback, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRouter } from "@/i18n/navigation";
import type { Island } from "@/content/islands";

/** Offset (world units, relative to the island's chart position) the camera
 * settles at once framing an island: above and slightly back, so the whole
 * island silhouette reads before the route swap. */
const CAMERA_OFFSET = new THREE.Vector3(0, 4, 7);
const SAIL_DURATION = 1.2;

export type OrbitControlsRef = React.RefObject<OrbitControlsImpl | null>;

/**
 * `sailTo(island)`: tweens the r3f camera's position *and* look-at target
 * toward the given island over ~1.2s (GSAP, `power2.inOut`), then
 * navigates to `/isle/[slug]` via next-intl's locale-aware `useRouter`
 * (never hardcode the locale prefix — `router.push` adds it).
 *
 * Coordinating with `<OrbitControls>` (drei): drei's OrbitControls only
 * calls `controls.update()` on frames where `controls.enabled` is true
 * (see `@react-three/drei/core/OrbitControls.js`) — so simply flipping
 * `enabled` to `false` for the tween's duration is enough to fully stop it
 * from re-deriving `camera.position` off its own (stale) spherical state
 * every frame and fighting the GSAP tween. Because OrbitControls is no
 * longer calling `camera.lookAt` for us while disabled, this hook drives
 * the look-at itself each tick, lerping from the controls' current target
 * to the island's position, and keeps `controls.target` in sync so that
 * once controls re-enable (or the scene re-renders) orbiting resumes
 * centered on the island instead of snapping back to the old target.
 *
 * `sailingRef` guards against double-triggering: a second click/Enter
 * while a sail is already in flight is a no-op.
 */
export function useCameraSail(controlsRef?: OrbitControlsRef) {
  const { camera } = useThree();
  const router = useRouter();
  const sailingRef = useRef(false);

  const sailTo = useCallback(
    (island: Island) => {
      if (sailingRef.current) {
        return;
      }
      sailingRef.current = true;

      const controls = controlsRef?.current ?? null;
      const wasEnabled = controls?.enabled ?? false;
      if (controls) {
        controls.enabled = false;
      }

      const [x, z] = island.pos;
      const targetPos = new THREE.Vector3(x, 0, z);
      const cameraDest = targetPos.clone().add(CAMERA_OFFSET);
      const startTarget = controls ? controls.target.clone() : new THREE.Vector3(0, 0, 0);
      const progress = { t: 0 };

      gsap.timeline({
        defaults: { duration: SAIL_DURATION, ease: "power2.inOut" },
        onComplete: () => {
          if (controls) {
            controls.target.copy(targetPos);
            controls.enabled = wasEnabled;
            controls.update();
          }
          sailingRef.current = false;
          router.push(`/isle/${island.slug}`);
        },
      })
        .to(camera.position, { x: cameraDest.x, y: cameraDest.y, z: cameraDest.z }, 0)
        .to(
          progress,
          {
            t: 1,
            onUpdate: () => {
              const lookAt = startTarget.clone().lerp(targetPos, progress.t);
              if (controls) {
                controls.target.copy(lookAt);
              }
              camera.lookAt(lookAt);
            },
          },
          0,
        );
    },
    [camera, controlsRef, router],
  );

  return { sailTo };
}
