"use client";

import { useCallback, useEffect, useRef } from "react";
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
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const mountedRef = useRef(true);

  // Kill any in-flight sail timeline on unmount so it can't keep mutating a
  // detached camera/controls, and can't fire its onComplete (router.push,
  // controls.update()) after the locale-scoped tree has already unmounted —
  // e.g. the user clicks an island, then clicks LocaleSwitcher or a hero
  // Link before the 1.2s sail finishes.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, []);

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
      const lookAt = startTarget.clone();
      const progress = { t: 0 };

      const tl = gsap.timeline({
        defaults: { duration: SAIL_DURATION, ease: "power2.inOut" },
        onComplete: () => {
          // Belt-and-suspenders: killing the timeline on unmount prevents
          // onComplete from firing at all, but guard anyway against a
          // stray tick sneaking in the middle of teardown so a torn-down
          // OrbitControls never gets .update()'d and we never navigate
          // away from a page/locale the user has already left.
          if (!mountedRef.current) {
            return;
          }
          if (controls) {
            controls.target.copy(targetPos);
            controls.enabled = wasEnabled;
            controls.update();
          }
          sailingRef.current = false;
          tlRef.current = null;
          router.push(`/isle/${island.slug}`);
        },
      })
        .to(camera.position, { x: cameraDest.x, y: cameraDest.y, z: cameraDest.z }, 0)
        .to(
          progress,
          {
            t: 1,
            onUpdate: () => {
              lookAt.copy(startTarget).lerp(targetPos, progress.t);
              if (controls) {
                controls.target.copy(lookAt);
              }
              camera.lookAt(lookAt);
            },
          },
          0,
        );

      tlRef.current = tl;
    },
    [camera, controlsRef, router],
  );

  return { sailTo };
}
