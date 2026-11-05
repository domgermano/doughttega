import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stats, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import netUrl from "../assets/net_3d.glb";

// --- 3D net (loaded from Blender) ---

// The model is ~0.32 units long, so scale it up to fill the canvas.
const MODEL_SCALE = 17;

// Colour used by the net strands (the depth mask is never visible).
const NET_COLOR = "white";

// Camera: narrow fov = flatter, more "telephoto" look.
// Visible height at the log = 2 * distance * tan(fov / 2). At fov 20 and
// distance 8 that is ~2.8 units, which fits the 1.4-unit-wide log with margin.
// If you change the fov, scale the distance to keep the log the same size.
const CAMERA_FOV = 20;
const CAMERA_DISTANCE = 8;

// --- Scroll momentum tuning ---
// Scrolling *pushes* the log: each scroll delta adds to an angular velocity,
// and friction slowly bleeds it away so the log keeps coasting after you stop.
type Tuning = {
  mode: "scroll" | "spin";
  gain: number; // radians/second of velocity added per scrolled pixel
  friction: number; // higher = stops sooner (per second)
};
const DEFAULT_TUNING: Tuning = { mode: "scroll", gain: 0.05, friction: 1 };

const MAX_VELOCITY = 2; // rad/s: stops a hard flick from spinning wildly
const EPSILON = 0.001; // below this speed we stop rendering
const SPIN_SPEED = 0.6; // rad/s: fixed-spin fallback mode

function Net({ tuning }: { tuning: RefObject<Tuning> }) {
  const spinRef = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const { nodes } = useGLTF(netUrl) as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };

  // Motion state lives in refs, so scrolling never causes a React re-render.
  const velocity = useRef(0);

  // Scroll: turn each scroll delta into a push, then wake the render loop.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const delta = window.scrollY - lastY;
      lastY = window.scrollY;
      if (tuning.current.mode !== "scroll") {
        invalidate(); // also how the mode dropdown restarts the spin loop
        return;
      }
      velocity.current = THREE.MathUtils.clamp(
        velocity.current + delta * tuning.current.gain,
        -MAX_VELOCITY,
        MAX_VELOCITY,
      );
      invalidate();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [invalidate, tuning]);

  // Every frame: move, apply friction, and keep rendering only while moving.
  // `dt` is in seconds, so speed is the same at 60Hz and 120Hz.
  useFrame((_, dt) => {
    const group = spinRef.current;
    if (!group) return;
    const t = tuning.current;

    if (t.mode === "spin") {
      group.rotation.x += SPIN_SPEED * dt;
      invalidate(); // spin never settles, so ask for the next frame
      return;
    }

    group.rotation.x += velocity.current * dt;
    velocity.current *= Math.exp(-t.friction * dt);
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
      <mesh geometry={nodes.Underlay.geometry} renderOrder={0}>
        <meshBasicMaterial colorWrite={false} side={THREE.FrontSide} />
      </mesh>

      {/* The net itself: flat, unlit colour. */}
      <mesh geometry={nodes.Net.geometry} renderOrder={1}>
        <meshBasicMaterial color={NET_COLOR} />
      </mesh>
    </group>
  );
}

// --- Prototype page ---
// Tall spacers above and below the log so there is real page to scroll.
const spacer = {
  height: "150vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255,255,255,0.7)",
  fontFamily: "monospace",
} as const;

export default function NetPrototype() {
  // Sliders edit this ref live; Net reads it every frame (no re-renders).
  const tuning = useRef<Tuning>({ ...DEFAULT_TUNING });
  const [mode, setMode] = useState(DEFAULT_TUNING.mode);
  const [gain, setGain] = useState(DEFAULT_TUNING.gain);
  const [friction, setFriction] = useState(DEFAULT_TUNING.friction);

  return (
    <div style={{ background: "#A39416" }}>
      <div style={spacer}>scroll down ↓</div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "90%", maxWidth: "900px", aspectRatio: "3 / 1" }}>
          <Canvas
            frameloop="demand"
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0, CAMERA_DISTANCE], fov: CAMERA_FOV }}
            style={{ width: "100%", height: "100%" }}
          >
            <Net tuning={tuning} />
            <Stats />
          </Canvas>
        </div>
      </div>

      <div style={spacer}>scroll up ↑</div>

      {/* Fixed so the controls stay visible while scrolling */}
      <div
        style={{
          position: "fixed",
          left: 16,
          bottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "12px",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          fontFamily: "monospace",
          fontSize: "13px",
        }}
      >
        <label>
          mode:{" "}
          <select
            value={mode}
            onChange={(e) => {
              const m = e.target.value as Tuning["mode"];
              tuning.current.mode = m;
              setMode(m);
              // Wake the demand loop so spin mode starts immediately
              window.dispatchEvent(new Event("scroll"));
            }}
          >
            <option value="scroll">scroll (momentum)</option>
            <option value="spin">spin (fixed)</option>
          </select>
        </label>
        <Slider
          label="gain (push per px)"
          value={gain}
          min={0.05}
          max={2}
          step={0.05}
          onChange={(v) => {
            tuning.current.gain = v;
            setGain(v);
          }}
        />
        <Slider
          label="friction (higher = stops sooner)"
          value={friction}
          min={0.3}
          max={8}
          step={0.1}
          onChange={(v) => {
            tuning.current.friction = v;
            setFriction(v);
          }}
        />
      </div>
    </div>
  );
}

function Slider(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span>
        {props.label}: {props.value.toFixed(2)}
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(+e.target.value)}
        style={{ width: "240px" }}
      />
    </label>
  );
}
