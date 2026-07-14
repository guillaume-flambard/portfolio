"use client";

import { useEffect } from "react";
import { useControls, folder, Leva } from "leva";
import type { SceneParams } from "@/three/Canvas3D";

type DevPanelProps = {
  /** Seed values — the current `SCENE` defaults from `Canvas3D.tsx`. Leva
   * only reads this once (on mount) to build its initial slider positions;
   * live edits flow out through `onChange`, not back in through `base`. */
  base: SceneParams;
  /** Called on every Leva control change with a full, freshly-assembled
   * `SceneParams` — the parent (`Canvas3D`) just sets this straight as its
   * live scene state. */
  onChange: (next: SceneParams) => void;
};

/**
 * Dev-only Leva GUI bound to every `SCENE` param the controller is likely
 * to want to nudge between renders: AO, Bloom, DoF, Vignette, fog and
 * lights. Rendered only when `Canvas3D`'s `IS_DEV` flag is true, and
 * `next/dynamic`-loaded so this module (and `leva` itself) is never part
 * of the production bundle — see the dynamic-import comment in
 * `Canvas3D.tsx`.
 *
 * Deliberately does NOT expose `camera` — the `<Canvas camera>` prop only
 * seeds the camera at mount time, and this scene hands camera control off
 * to `OrbitControls`/`useCameraSail`/`useExploreCamera` right after; making
 * fov/position "live" would require manually reaching into the camera
 * object and calling `updateProjectionMatrix()`, which risks fighting
 * those hooks for no real tuning benefit on a background scene.
 */
export function DevPanel({ base, onChange }: DevPanelProps) {
  const values = useControls("Scene", {
    AO: folder({
      aoRadius: { value: base.ao.radius, min: 0, max: 4, step: 0.05 },
      aoIntensity: { value: base.ao.intensity, min: 0, max: 4, step: 0.05 },
      aoDistanceFalloff: { value: base.ao.distanceFalloff, min: 0, max: 4, step: 0.05 },
    }),
    Bloom: folder({
      bloomThreshold: { value: base.bloom.luminanceThreshold, min: 0, max: 1, step: 0.01 },
      bloomSmoothing: { value: base.bloom.luminanceSmoothing, min: 0, max: 1, step: 0.01 },
      bloomIntensity: { value: base.bloom.intensity, min: 0, max: 2, step: 0.01 },
    }),
    DOF: folder({
      dofFocusDistance: { value: base.dof.focusDistance, min: 0, max: 1, step: 0.001 },
      dofFocalLength: { value: base.dof.focalLength, min: 0, max: 1, step: 0.001 },
      dofBokehScale: { value: base.dof.bokehScale, min: 0, max: 6, step: 0.1 },
    }),
    Vignette: folder({
      vignetteOffset: { value: base.vignette.offset, min: 0, max: 1, step: 0.01 },
      vignetteDarkness: { value: base.vignette.darkness, min: 0, max: 1, step: 0.01 },
    }),
    Fog: folder({
      fogColor: base.fog.color,
      fogNear: { value: base.fog.near, min: 0, max: 60, step: 1 },
      fogFar: { value: base.fog.far, min: 0, max: 100, step: 1 },
    }),
    Lights: folder({
      ambient: { value: base.lights.ambient, min: 0, max: 2, step: 0.01 },
      keyIntensity: { value: base.lights.keyIntensity, min: 0, max: 3, step: 0.01 },
      keyPos: { value: base.lights.keyPos },
      keyColor: base.lights.keyColor,
      hemiIntensity: { value: base.lights.hemiIntensity, min: 0, max: 2, step: 0.01 },
      hemiSky: base.lights.hemiSky,
      hemiGround: base.lights.hemiGround,
    }),
    Motion: folder({
      autoRotateSpeed: { value: base.autoRotateSpeed, min: 0, max: 2, step: 0.01 },
    }),
  });

  // Depend on individual primitives (not the `values` object reference,
  // which leva may recreate every render) so this only fires when a
  // control actually changes — never an infinite render loop.
  useEffect(() => {
    onChange({
      ao: {
        radius: values.aoRadius,
        intensity: values.aoIntensity,
        distanceFalloff: values.aoDistanceFalloff,
        halfRes: base.ao.halfRes,
      },
      bloom: {
        luminanceThreshold: values.bloomThreshold,
        luminanceSmoothing: values.bloomSmoothing,
        intensity: values.bloomIntensity,
      },
      dof: {
        focusDistance: values.dofFocusDistance,
        focalLength: values.dofFocalLength,
        bokehScale: values.dofBokehScale,
      },
      vignette: { offset: values.vignetteOffset, darkness: values.vignetteDarkness },
      fog: { color: values.fogColor, near: values.fogNear, far: values.fogFar },
      lights: {
        ambient: values.ambient,
        keyIntensity: values.keyIntensity,
        keyPos: values.keyPos as [number, number, number],
        keyColor: values.keyColor,
        hemiSky: values.hemiSky,
        hemiGround: values.hemiGround,
        hemiIntensity: values.hemiIntensity,
      },
      camera: base.camera,
      autoRotateSpeed: values.autoRotateSpeed,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values.aoRadius,
    values.aoIntensity,
    values.aoDistanceFalloff,
    values.bloomThreshold,
    values.bloomSmoothing,
    values.bloomIntensity,
    values.dofFocusDistance,
    values.dofFocalLength,
    values.dofBokehScale,
    values.vignetteOffset,
    values.vignetteDarkness,
    values.fogColor,
    values.fogNear,
    values.fogFar,
    values.ambient,
    values.keyIntensity,
    values.keyColor,
    values.hemiIntensity,
    values.hemiSky,
    values.hemiGround,
    values.autoRotateSpeed,
    onChange,
    base,
  ]);

  return <Leva collapsed titleBar={{ title: "Scene tuning" }} />;
}

/**
 * FPS overlay was removed: `r3f-perf` bundles a `.woff.mjs` that breaks the
 * Turbopack build (Next 16). Tuning is done via the Leva `<DevPanel>` instead.
 */
export function DevPerf() {
  return null;
}
