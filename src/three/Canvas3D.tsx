"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { EffectComposer, N8AO, Bloom, DepthOfField, Vignette, SMAA } from "@react-three/postprocessing";
import Sea from "@/three/Sea";
import Island from "@/three/Island";
import Wake, { type WakeHandle } from "@/three/Wake";
import { useHover } from "@/three/useHover";
import { useCameraSail } from "@/three/useCameraSail";
import { useExploreCamera } from "@/three/useExploreCamera";
import { useExplore } from "@/three/explore-context";
import type { Island as IslandData } from "@/content/islands";
import type { Locale } from "@/content/islands";

type Canvas3DProps = {
  islands: IslandData[];
  locale: Locale;
};

/**
 * KEY VISUAL PARAMS — the single tuning surface for the whole cinematic
 * post-processing stack + lighting. Every value the controller will want to
 * nudge between renders lives here, nowhere else; the JSX below only reads
 * from `SCENE` (or, in dev, from the Leva-tuned copy of it — see
 * `./DevTools`). Keep this the *only* place literal tuning numbers appear.
 *
 * Defaults were chosen conservative/elegant per spec: AO is the "big win"
 * (subtle radius/intensity so terraces read as solid + grounded without
 * turning muddy), Bloom only catches the brightest highlights (phosphor
 * wake, sun-lit peaks), DoF is a gentle mid-scene focus pull, Vignette is
 * barely-there edge darkening.
 */
export const SCENE = {
  /** N8AO — screen-space ambient occlusion. The main premium-feel driver:
   * makes stacked terraces read as solid, grounded geometry instead of
   * flat cutout shapes. */
  ao: {
    /** World-space sample radius. Small islands (~2 unit base radius), so
     * keep this tight — too large reads as a dark halo around every island. */
    radius: 1.4,
    /** Occlusion strength. Subtle: darkens creases between terraces without
     * muddying the paper-toned color ramp. */
    intensity: 1.6,
    /** How quickly occlusion fades with distance from the camera — keeps AO
     * confined to nearby islands rather than smearing across the whole sea. */
    distanceFalloff: 1.0,
    /** Half-resolution AO pass: this effect is the most GPU-heavy of the
     * stack, and the softness loss is invisible at this scene's scale. */
    halfRes: true,
  },
  /** Bloom — deliberately restrained: only the phosphor wake and the very
   * brightest sunlit peak highlights should catch a glow, not the whole
   * warm-paper scene. */
  bloom: {
    /** High threshold so only near-white highlights bloom. */
    luminanceThreshold: 0.9,
    /** Soft knee around the threshold instead of a hard cutoff. */
    luminanceSmoothing: 0.25,
    intensity: 0.3,
  },
  /** DepthOfField — gentle focus pull: mid-scene islands sharp, background
   * softly blurred, never a heavy "tilt-shift" toy effect. */
  dof: {
    /** Normalized focus distance (0..1 of the camera's near/far range). */
    focusDistance: 0.02,
    /** Normalized focal length — small value keeps the in-focus band wide. */
    focalLength: 0.05,
    /** Bokeh circle scale — subtle, not a heavy blur. */
    bokehScale: 2,
  },
  /** Vignette — barely-there edge darkening for a premium framed feel. */
  vignette: {
    offset: 0.3,
    darkness: 0.4,
  },
  /** Paper-coloured fog: distant islands melt into the horizon instead of
   * hard-clipping, a cheap but premium depth cue. Tuned so all 5 islands
   * (chart coords roughly within a 6-unit radius) read clearly while the
   * far edge of the sea plane fades out. */
  fog: {
    color: "#FFFBEB",
    near: 18,
    far: 48,
  },
  /** Soft cinematic lighting: low ambient fill, one warm key light
   * (upper-side, casts the shadows), and a sky/ground hemisphere light for
   * a gentle bounce instead of flat, harsh shading. */
  lights: {
    ambient: 0.5,
    keyIntensity: 0.85,
    keyPos: [6, 11, 4] as [number, number, number],
    keyColor: "#FFE8C2",
    hemiSky: "#FFFBEB",
    hemiGround: "#78716C",
    hemiIntensity: 0.35,
  },
  camera: {
    position: [0, 6, 16] as [number, number, number],
    fov: 45,
  },
  /** `autoRotate` is OrbitControls' own built-in idle drift — very slow here
   * so the scene feels alive before any interaction. */
  autoRotateSpeed: 0.3,
};

export type SceneParams = typeof SCENE;

const IS_DEV = process.env.NODE_ENV !== "production";

/**
 * Dev-only Leva panel + r3f-perf overlay, code-split via `next/dynamic` so
 * neither `leva` nor `r3f-perf` ever ship in the production client bundle:
 * in production `IS_DEV` is `false`, so `<DevPanel>`/`<DevPerf>` are never
 * mounted and the dynamic `import()` below is never actually invoked —
 * the chunk is simply never requested over the network.
 */
const DevPanel = dynamic(() => import("@/three/DevTools").then((mod) => mod.DevPanel), {
  ssr: false,
});
const DevPerf = dynamic(() => import("@/three/DevTools").then((mod) => mod.DevPerf), {
  ssr: false,
});

/**
 * The actual R3F scene subtree. Kept in its own module so it can be
 * lazy-loaded via `next/dynamic` with `{ ssr: false }` — this keeps
 * three.js / @react-three/fiber out of the server-rendered / initial
 * JS bundle entirely.
 *
 * Task 8 added the camera/lights placeholder; Task 9 added the nautical
 * sea shader plane (`./Sea`). Task 10 maps the island registry to one
 * `<Island>` per entry, positioned at its chart coordinates with a
 * locale-aware label. Task 11 wires up `useHover` (island hover →
 * `pointer` cursor) and `Wake` (a phosphor trail following the pointer
 * across the sea). This pass adds the cinematic post-processing stack
 * (`<EffectComposer>`: N8AO/Bloom/DepthOfField/Vignette/SMAA) driven by
 * the `SCENE` params above.
 *
 * `<Canvas>` itself has to stay a thin wrapper: hooks like `useThree`
 * (which `useCameraSail` needs, to reach the r3f camera) only work
 * inside the fiber tree `<Canvas>` creates, not in the component that
 * renders `<Canvas>`. So the actual scene contents — and Task 12's sail
 * wiring — live in the nested `Scene` component below.
 */
export default function Canvas3D({ islands, locale }: Canvas3DProps) {
  // Live-tunable copy of `SCENE`: in dev, `<DevPanel>` (Leva) overwrites this
  // as the controller drags sliders; in production `<DevPanel>` never
  // mounts, so `onChange` is never called and this stays `SCENE` forever —
  // zero extra renders, zero leva/r3f-perf code ever touched at runtime.
  const [scene, setScene] = useState<SceneParams>(SCENE);

  return (
    <>
      {IS_DEV && <DevPanel base={SCENE} onChange={setScene} />}
      <Canvas
        camera={{ position: SCENE.camera.position, fov: SCENE.camera.fov }}
        // Soft shadows: islands/Sea opt in per-mesh via castShadow/
        // receiveShadow; the key light below carries the actual shadow map.
        shadows="soft"
        // Cap device pixel ratio at 1.5 (Task 13 perf budget) so retina/
        // hi-dpi screens don't multiply fragment-shader/post-fx cost for no
        // visual gain on this background scene.
        dpr={[1, 1.5]}
        // Deliberately NOT `frameloop="demand"`: `Sea` and `Wake` animate
        // continuously via `useFrame` (shader time uniform, wake decay).
        // `demand` only re-renders on explicit `invalidate()` calls, which
        // would freeze both animations. Default (`"always"`) is required.
        style={{ width: "100%", height: "100%" }}
      >
        <Scene islands={islands} locale={locale} scene={scene} />
      </Canvas>
    </>
  );
}

type SceneComponentProps = Canvas3DProps & {
  scene: SceneParams;
};

function Scene({ islands, locale, scene }: SceneComponentProps) {
  const { onPointerOver, onPointerOut } = useHover();
  const wakeRef = useRef<WakeHandle>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { sailTo } = useCameraSail(controlsRef);
  const { exploring } = useExplore();
  useExploreCamera(exploring, controlsRef);

  const handleSeaPointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    wakeRef.current?.addPoint(event.point);
  }, []);

  return (
    <>
      {/* Paper-coloured fog — see `SCENE.fog` above for the tuning notes. */}
      <fog attach="fog" args={[scene.fog.color, scene.fog.near, scene.fog.far]} />

      {/* Soft cinematic lighting — see `SCENE.lights` above. */}
      <ambientLight intensity={scene.lights.ambient} />
      <hemisphereLight
        args={[scene.lights.hemiSky, scene.lights.hemiGround, scene.lights.hemiIntensity]}
      />
      <directionalLight
        position={scene.lights.keyPos}
        intensity={scene.lights.keyIntensity}
        color={scene.lights.keyColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0015}
      />

      <Sea onPointerMove={handleSeaPointerMove} />
      <Wake ref={wakeRef} />
      {islands.map((island) => (
        <Island
          island={island}
          locale={locale}
          key={island.slug}
          onHoverStart={() => onPointerOver(island.slug)}
          onHoverEnd={() => onPointerOut(island.slug)}
          onActivate={() => sailTo(island)}
        />
      ))}
      {/* `autoRotate` is OrbitControls' own built-in idle drift — very slow
          here so the scene feels alive before any interaction. It naturally
          stops contributing whenever `controls.enabled` is false (see
          `useCameraSail`/`useExploreCamera`: both disable controls for the
          duration of a GSAP tween), so it never fights a sail or the
          enter-explore camera ease. */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        autoRotate
        autoRotateSpeed={scene.autoRotateSpeed}
      />

      {/*
        Cinematic post-processing stack. Order matters (AO first, SMAA
        last): N8AO grounds the terraces, Bloom picks out only the
        brightest highlights (phosphor wake / sun-lit peaks), DepthOfField
        pulls a gentle mid-scene focus, Vignette frames the shot, SMAA
        antialiases the composited result. `multisampling={0}` on the
        composer avoids paying for MSAA *and* SMAA at once. No per-frame
        allocation here — every prop is a primitive/array read straight
        from `scene`, recomputed only when a Leva control changes it.
      */}
      <EffectComposer multisampling={0}>
        <N8AO
          aoRadius={scene.ao.radius}
          intensity={scene.ao.intensity}
          distanceFalloff={scene.ao.distanceFalloff}
          halfRes={scene.ao.halfRes}
          quality="medium"
        />
        <Bloom
          luminanceThreshold={scene.bloom.luminanceThreshold}
          luminanceSmoothing={scene.bloom.luminanceSmoothing}
          intensity={scene.bloom.intensity}
          mipmapBlur
        />
        <DepthOfField
          focusDistance={scene.dof.focusDistance}
          focalLength={scene.dof.focalLength}
          bokehScale={scene.dof.bokehScale}
        />
        <Vignette offset={scene.vignette.offset} darkness={scene.vignette.darkness} />
        <SMAA />
      </EffectComposer>

      {/* r3f-perf FPS overlay — dev-only, code-split, see `DevPanel` above
          for why this never ships to production. Wrapped in `Suspense`
          since `next/dynamic` lazy-loads it via `React.lazy` under the
          hood. */}
      {IS_DEV && (
        <Suspense fallback={null}>
          <DevPerf />
        </Suspense>
      )}
    </>
  );
}
