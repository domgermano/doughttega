import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// --- Geometry parameters ---
const RADIUS = 1;
const HALF_LENGTH = 1.75;
const STRANDS = 15;
const RINGS_CYLINDER = 24;
const RINGS_HEMI = 5;
const WONK = 0.02;

function seededRng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rAtX(x: number): number {
  if (x < -HALF_LENGTH)
    return Math.sqrt(Math.max(0, RADIUS ** 2 - (x + HALF_LENGTH) ** 2));
  if (x > HALF_LENGTH)
    return Math.sqrt(Math.max(0, RADIUS ** 2 - (x - HALF_LENGTH) ** 2));
  return RADIUS;
}

function circlePoints(cx: number, r: number, n = 12): THREE.Vector3[] {
  return Array.from({ length: n + 1 }, (_, j) => {
    const theta = (j / n) * Math.PI * 2;
    return new THREE.Vector3(cx, r * Math.cos(theta), r * Math.sin(theta));
  });
}

function buildNet() {
  const rng = seededRng(42);

  // Ring x positions — include actual tips so strands converge fully
  const xs: number[] = [
    -(HALF_LENGTH + RADIUS),
    HALF_LENGTH + RADIUS,
  ];
  for (let i = 1; i <= RINGS_HEMI; i++) {
    const a = (i / RINGS_HEMI) * (Math.PI / 2);
    xs.push(-HALF_LENGTH - RADIUS * Math.cos(a));
  }
  for (let i = 1; i < RINGS_CYLINDER; i++) {
    xs.push(-HALF_LENGTH + (i / RINGS_CYLINDER) * 2 * HALF_LENGTH);
  }
  for (let i = 0; i < RINGS_HEMI; i++) {
    const a = (i / RINGS_HEMI) * (Math.PI / 2);
    xs.push(HALF_LENGTH + RADIUS * Math.sin(a));
  }
  xs.sort((a, b) => a - b);

  // Shared vertex grid — each (ringIdx, strandIdx) pair gets one noise value,
  // applied once. Rings and strands both read from the same grid, so every
  // intersection is a single shared point and lines connect exactly.
  const grid: THREE.Vector3[][] = xs.map((x) =>
    Array.from({ length: STRANDS }, (_, si) => {
      const theta = (si / STRANDS) * Math.PI * 2;
      const r = rAtX(x);
      return new THREE.Vector3(
        x + (rng() - 0.5) * WONK,
        r * Math.cos(theta) + (rng() - 0.5) * WONK,
        r * Math.sin(theta) + (rng() - 0.5) * WONK,
      );
    }),
  );

  // Rings: one closed loop per x position
  const rings = grid
    .filter((_, ri) => rAtX(xs[ri]) > 0.01)
    .map((row) => [...row, row[0]]);

  // Strands: one open line per angular position, tip to tip
  const strands = Array.from({ length: STRANDS }, (_, si) =>
    xs.map((_, ri) => grid[ri][si]),
  );

  // End knots: a cinch ring at each tip + a round "tied-off" ball beyond
  const knots: THREE.Vector3[][] = [];
  const CINCH_R = RADIUS * 0.15;
  const BALL_R = RADIUS * 0.4;

  for (const [xTip, dir] of [
    [-HALF_LENGTH - RADIUS, -1],
    [HALF_LENGTH + RADIUS, 1],
  ] as [number, number][]) {
    // Cinch: tight ring at the gather point
    knots.push(circlePoints(xTip, CINCH_R));

    // Ball: 4 rings that swell then taper, like a tied-off sausage casing
    knots.push(circlePoints(xTip + dir * RADIUS * 0.15, BALL_R * 0.7));
    knots.push(circlePoints(xTip + dir * RADIUS * 0.3, BALL_R));
    knots.push(circlePoints(xTip + dir * RADIUS * 0.45, BALL_R * 0.65));
    knots.push(circlePoints(xTip + dir * RADIUS * 0.6, BALL_R * 0.15));

    // Tying lines: 6 lines from the cinch to the ball equator, offset by half
    // a gap to look like a string wrapped around the gather
    const N = 6;
    for (let i = 0; i < N; i++) {
      const tA = (i / N) * Math.PI * 2;
      const tB = tA + Math.PI / N;
      knots.push([
        new THREE.Vector3(xTip, CINCH_R * Math.cos(tA), CINCH_R * Math.sin(tA)),
        new THREE.Vector3(
          xTip + dir * RADIUS * 0.3,
          BALL_R * Math.cos(tB),
          BALL_R * Math.sin(tB),
        ),
      ]);
    }
  }

  return { rings, strands, knots };
}

// --- 3D net ---
function Net({ rotation }: { rotation: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { rings, strands, knots } = useMemo(buildNet, []);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.x = rotation;
  });

  return (
    <group ref={groupRef}>
      {/*
        Depth mask: invisible capsule slightly smaller than the net.
        Writes depth but not colour — back strands fail the depth test
        and are hidden, giving a front-only look.
      */}
      <mesh renderOrder={0} rotation={[0, 0, Math.PI / 2]} scale={0.95}>
        <capsuleGeometry args={[RADIUS, HALF_LENGTH * 2, 8, 24]} />
        <meshBasicMaterial colorWrite={false} side={THREE.FrontSide} />
      </mesh>

      {rings.map((pts, i) => (
        <Line key={`r${i}`} points={pts} color="white" lineWidth={1.5} renderOrder={1} />
      ))}
      {strands.map((pts, i) => (
        <Line key={`s${i}`} points={pts} color="white" lineWidth={1.5} renderOrder={1} />
      ))}
      {knots.map((pts, i) => (
        <Line key={`k${i}`} points={pts} color="white" lineWidth={1.5} renderOrder={1} />
      ))}
    </group>
  );
}

// --- Prototype page ---
export default function NetPrototype() {
  const [rotation, setRotation] = useState(0);

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
          camera={{ position: [0, 0, 3], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Net rotation={rotation} />
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
        <label>rotation: {rotation.toFixed(2)} rad</label>
        <input
          type="range"
          min={0}
          max={Math.PI * 2}
          step={0.01}
          value={rotation}
          onChange={(e) => setRotation(+e.target.value)}
          style={{ width: "300px" }}
        />
      </div>
    </div>
  );
}
