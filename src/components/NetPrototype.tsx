import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import netUrl from "../assets/net_3d.glb";

// --- 3D net (loaded from Blender) ---

// The model is ~0.32 units long, so scale it up to fill the canvas.
const MODEL_SCALE = 17;

// Colour used by the depth-only mask (never visible) and the net strands.
const NET_COLOR = "white";

// Keeps the log the same apparent size when the FOV changes:
// visible height at the log = 2 * distance * tan(fov / 2), so hold that constant.
const BASE_FOV = 20;
const BASE_DISTANCE = 3;

function CameraRig({ fov, zoom }: { fov: number; zoom: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const distance =
    (BASE_DISTANCE * Math.tan((BASE_FOV / 2) * (Math.PI / 180))) /
    Math.tan((fov / 2) * (Math.PI / 180)) /
    zoom;

  useEffect(() => {
    camera.fov = fov;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, fov, distance]);

  return null;
}

function Net({
  rotation,
  yaw,
  pitch,
}: {
  rotation: number;
  yaw: number;
  pitch: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes } = useGLTF(netUrl) as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.x = rotation;
  });

  return (
    // Outer group tilts the whole log (yaw turns an end towards the camera,
    // pitch tips it up). Inner group does the spin around the long axis.
    <group rotation={[0, yaw, pitch]}>
      <group ref={groupRef} scale={MODEL_SCALE}>
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
    </group>
  );
}

// --- Prototype page ---
export default function NetPrototype() {
  const [rotation, setRotation] = useState(0);
  const [fov, setFov] = useState(BASE_FOV);
  const [zoom, setZoom] = useState(1);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#A39416",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
      }}
    >
      <div style={{ width: "90%", maxWidth: "900px", aspectRatio: "3 / 1" }}>
        <Canvas
          frameloop="always"
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, BASE_DISTANCE], fov: BASE_FOV }}
          style={{ width: "100%", height: "100%" }}
        >
          <CameraRig fov={fov} zoom={zoom} />
          <Net rotation={rotation} yaw={yaw} pitch={pitch} />
        </Canvas>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          color: "white",
          fontFamily: "monospace",
          fontSize: "13px",
        }}
      >
        <Slider
          label="spin"
          value={rotation}
          min={0}
          max={Math.PI * 2}
          step={0.01}
          onChange={setRotation}
        />
        <Slider
          label="fov (lower = flatter)"
          value={fov}
          min={5}
          max={90}
          step={1}
          onChange={setFov}
        />
        <Slider
          label="zoom"
          value={zoom}
          min={0.5}
          max={2}
          step={0.01}
          onChange={setZoom}
        />
        <Slider
          label="yaw (turn end to camera)"
          value={yaw}
          min={-1}
          max={1}
          step={0.01}
          onChange={setYaw}
        />
        <Slider
          label="pitch (tip up/down)"
          value={pitch}
          min={-1}
          max={1}
          step={0.01}
          onChange={setPitch}
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
    <label style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <span style={{ width: "200px", textAlign: "right" }}>
        {props.label}: {props.value.toFixed(2)}
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(+e.target.value)}
        style={{ width: "300px" }}
      />
    </label>
  );
}
