import { useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
// three's own loader instead of drei's useGLTF: drei pulls ~700 KB of
// unrelated helpers into the bundle.
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import netUrl from "../assets/net_3d.glb";

// --- 3D net (modelled in Blender, see src/assets/net_3d.glb) ---
// This file is lazy-loaded by NettingFigure so three.js stays out of the
// initial bundle.

// The model is ~0.32 units long, so scale it up.
const MODEL_SCALE = 17;
const MODEL_LENGTH = 0.32 * MODEL_SCALE; // ~5.4 units end to end
const MODEL_DIAMETER = 0.085 * MODEL_SCALE; // ~1.4 units across

// Colour of the net strands (the depth mask is never visible).
const NET_COLOR = "white";

// Camera: narrow fov = flatter, more "telephoto" look.
const CAMERA_FOV = 20;
// The log should fill most of the canvas width, but never get clipped
// top/bottom. These are the minimum visible widths/heights at the log.
const FIT_WIDTH = MODEL_LENGTH * 1.05;
const FIT_HEIGHT = MODEL_DIAMETER * 1.35;

// --- Motion tuning ---
// Scrolling *pushes* the log: each scrolled pixel adds angular velocity, and
// friction bleeds it away so the log coasts after you stop.
const GAIN = 0.05; // rad/s added per scrolled pixel
const FRICTION = 1; // higher = stops sooner (per second)
const MAX_VELOCITY = 2; // rad/s: stops a hard flick spinning wildly
const EPSILON = 0.001; // below this speed we stop rendering
const SPIN_SPEED = 0.6; // rad/s: fixed-spin mode (not currently exposed)

export type NetMode = "scroll" | "spin";

// Positions the camera so the log fits the canvas at any aspect ratio.
function CameraRig() {
  const set = useThree((s) => s.set);
  const aspect = useThree((s) => s.size.width / s.size.height);

  useEffect(() => {
    const halfFov = (CAMERA_FOV / 2) * (Math.PI / 180);
    const visibleHeight = Math.max(FIT_HEIGHT, FIT_WIDTH / aspect);
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, 0.1, 100);
    camera.position.set(0, 0, visibleHeight / 2 / Math.tan(halfFov));
    set({ camera });
  }, [set, aspect]);

  return null;
}

// True while the canvas is on (or just next to) the screen. Held in a ref so
// changes never cause a React re-render. When it flips back to visible we
// wake the demand loop so the log redraws immediately.
function useOnScreen() {
  const canvas = useThree((s) => s.gl.domElement);
  const invalidate = useThree((s) => s.invalidate);
  const onScreen = useRef(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
        if (entry.isIntersecting) invalidate();
      },
      { rootMargin: "100px" }, // start slightly before it scrolls into view
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvas, invalidate]);

  return onScreen;
}

function Net({ mode }: { mode: NetMode }) {
  const spinRef = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const gltf = useLoader(GLTFLoader, netUrl);
  const underlay = gltf.scene.getObjectByName("Underlay") as THREE.Mesh;
  const net = gltf.scene.getObjectByName("Net") as THREE.Mesh;
  const onScreen = useOnScreen();

  // Motion state lives in a ref, so scrolling never causes a React re-render.
  const velocity = useRef(0);

  // Scroll: turn each scroll delta into a push, then wake the render loop.
  useEffect(() => {
    if (mode !== "scroll") return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const delta = window.scrollY - lastY;
      lastY = window.scrollY;
      if (!onScreen.current) return; // offscreen: don't spin, don't render
      velocity.current = THREE.MathUtils.clamp(
        velocity.current + delta * GAIN,
        -MAX_VELOCITY,
        MAX_VELOCITY,
      );
      invalidate();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [invalidate, mode, onScreen]);

  // Every frame: move, apply friction, and keep rendering only while moving.
  // `dt` is in seconds, so speed is the same at 60Hz and 120Hz.
  useFrame((_, dt) => {
    const group = spinRef.current;
    if (!group) return;

    if (!onScreen.current) {
      velocity.current = 0; // scrolled away mid-coast: stop, no more frames
      return;
    }

    if (mode === "spin") {
      group.rotation.x += SPIN_SPEED * dt;
      invalidate(); // spin never settles, so ask for the next frame
      return;
    }

    group.rotation.x += velocity.current * dt;
    velocity.current *= Math.exp(-FRICTION * dt);
    if (Math.abs(velocity.current) > EPSILON) invalidate();
    else velocity.current = 0;
  });

  return (
    <group ref={spinRef} scale={MODEL_SCALE}>
      {/*
        Depth mask ("Underlay" in Blender): sits just inside the net.
        Writes depth but not colour, so back strands fail the depth test
        and are hidden, giving a front-only look.
      */}
      <mesh geometry={underlay.geometry} renderOrder={0}>
        <meshBasicMaterial colorWrite={false} side={THREE.FrontSide} />
      </mesh>

      {/* The net itself: flat, unlit colour. */}
      <mesh geometry={net.geometry} renderOrder={1}>
        <meshBasicMaterial color={NET_COLOR} />
      </mesh>
    </group>
  );
}

type NetCanvasProps = {
  mode?: NetMode;
  /** Called once the WebGL context exists and the first frame is queued. */
  onReady?: () => void;
};

export default function NetCanvas({
  mode = "scroll",
  onReady,
}: NetCanvasProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <CameraRig />
      <Net mode={mode} />
      <Ready onReady={onReady} />
    </Canvas>
  );
}

// Rendered inside <Canvas> after <Net> has loaded (Canvas suspends until the
// model is ready), so this only fires once the net is actually on screen.
function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}
