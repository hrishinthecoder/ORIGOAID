import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";

/* ─────────────────────────────────────────────────────────────────────────
   The Tree of Life — a realistic crowdfunding tree.
   • brown woody trunk & branches
   • red flower shards (love / charity)
   • green leaf shards (community / growth)
   • gold coin shards (donation value)
   • pulse rings + sparkles in the four brand colors
   ───────────────────────────────────────────────────────────────────────── */

// ── Wood / bark palette (for trunk + branches) ──────────────────────────
// Goes from dark trunk base to warmer bark toward the tips.
const WOOD_SHADES = [
  "#3a2114", // dark brown — trunk
  "#5a3623", // cocoa      — main branches
  "#7a4b30", // saddle     — mid branches
  "#8d5a37", // sienna     — upper branches
  "#a66a3e", // warm bark  — tips
];
const WOOD_EMISSIVE = "#2a1a0e"; // barely-there warm inner glow

// ── Flower palette (red/pink, romantic charity feel) ────────────────────
const FLOWER_COLORS = [
  "#dc2626", // red
  "#ef4444", // love red
  "#e11d48", // rose
  "#f43f5e", // blush
  "#ec4899", // pink
  "#f472b6", // soft pink
];
const FLOWER_CENTER = "#fde047"; // stamen color (visible as small center dot)

// ── Leaf palette (variety of healthy greens) ────────────────────────────
const LEAF_COLORS = [
  "#16a34a",
  "#22c55e",
  "#10b981",
  "#15803d",
  "#65a30d",
  "#84cc16",
];

const COIN_COLOR    = "#fcd34d";
const COIN_EMISSIVE = "#f59e0b";

// ── Flower geometry (5-petal, shared module-level) ──────────────────────
let FLOWER_GEOM: THREE.BufferGeometry | null = null;
function getFlowerGeom() {
  if (FLOWER_GEOM) return FLOWER_GEOM;
  const shape = new THREE.Shape();
  const petals = 5;
  const innerR = 0.30;
  const outerR = 1.00;

  for (let i = 0; i < petals; i++) {
    const a1 = (i / petals) * Math.PI * 2;           // base
    const a2 = ((i + 0.5) / petals) * Math.PI * 2;   // tip
    const a3 = ((i + 1) / petals) * Math.PI * 2;     // next base

    const bx = Math.cos(a1) * innerR;
    const by = Math.sin(a1) * innerR;
    const tx = Math.cos(a2) * outerR;
    const ty = Math.sin(a2) * outerR;
    const nx = Math.cos(a3) * innerR;
    const ny = Math.sin(a3) * innerR;

    // Control points sit *outside* the tip to give rounded petals
    const c1x = Math.cos(a2 - 0.32) * outerR * 1.15;
    const c1y = Math.sin(a2 - 0.32) * outerR * 1.15;
    const c2x = Math.cos(a2 + 0.32) * outerR * 1.15;
    const c2y = Math.sin(a2 + 0.32) * outerR * 1.15;

    if (i === 0) shape.moveTo(bx, by);
    shape.quadraticCurveTo(c1x, c1y, tx, ty);
    shape.quadraticCurveTo(c2x, c2y, nx, ny);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.10,
    bevelSegments: 4,
    curveSegments: 22,
  });
  geo.center();
  geo.scale(0.55, 0.55, 0.55);
  FLOWER_GEOM = geo;
  return geo;
}

// ── Seeded RNG for consistent layout ────────────────────────────────────
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ── Types ───────────────────────────────────────────────────────────────
type ShardType = "flower" | "leaf" | "coin";
type BranchSeg = {
  start: THREE.Vector3;
  end: THREE.Vector3;
  thickness: number;
  depth: number;
};
type LeafShard = {
  pos: THREE.Vector3;
  size: number;
  color: string;
  phase: number;
  birthOrder: number;
  type: ShardType;
};

// ── Tree generation ─────────────────────────────────────────────────────
function generateTree(seed = 42, maxDepth = 4) {
  const rng = makeRng(seed);
  const branches: BranchSeg[] = [];
  const leaves: LeafShard[] = [];
  let leafCounter = 0;

  const pickType = (): ShardType => {
    const r = rng();
    // More leaves than flowers — realistic ratio
    if (r < 0.55) return "leaf";   // 55 %
    if (r < 0.85) return "flower"; // 30 %
    return "coin";                  // 15 %
  };
  const colorFor = (t: ShardType) =>
    t === "coin"
      ? COIN_COLOR
      : t === "flower"
        ? FLOWER_COLORS[Math.floor(rng() * FLOWER_COLORS.length)]
        : LEAF_COLORS[Math.floor(rng() * LEAF_COLORS.length)];

  function grow(
    start: THREE.Vector3,
    dir: THREE.Vector3,
    length: number,
    thickness: number,
    depth: number,
  ) {
    const end = start.clone().add(dir.clone().multiplyScalar(length));
    branches.push({ start: start.clone(), end: end.clone(), thickness, depth });

    if (depth >= maxDepth) {
      const cluster = 3 + Math.floor(rng() * 3);
      for (let i = 0; i < cluster; i++) {
        const t = pickType();
        leaves.push({
          pos: end.clone().add(
            new THREE.Vector3(
              (rng() - 0.5) * 0.4,
              (rng() - 0.5) * 0.4,
              (rng() - 0.5) * 0.4,
            ),
          ),
          size: t === "flower" ? 0.095 + rng() * 0.05 : 0.085 + rng() * 0.05,
          color: colorFor(t),
          phase: rng() * Math.PI * 2,
          birthOrder: leafCounter++,
          type: t,
        });
      }
      return;
    }

    const childCount = depth === 0 ? 5 : depth === 1 ? 3 : 2;
    const up = new THREE.Vector3(0, 1, 0);
    let right = new THREE.Vector3().crossVectors(dir, up);
    if (right.length() < 0.001) right = new THREE.Vector3(1, 0, 0);
    right.normalize();
    const forward = new THREE.Vector3().crossVectors(right, dir).normalize();

    for (let i = 0; i < childCount; i++) {
      const a = (i / childCount) * Math.PI * 2 + rng() * 0.5;
      const tilt = 0.45 + rng() * 0.35;
      const newDir = dir
        .clone()
        .addScaledVector(right, Math.cos(a) * tilt)
        .addScaledVector(forward, Math.sin(a) * tilt)
        .normalize();
      grow(
        end,
        newDir,
        length * (0.62 + rng() * 0.15),
        thickness * 0.65,
        depth + 1,
      );
    }
  }

  grow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 1.2, 0.22, 0);
  return { branches, leaves, totalLeaves: leafCounter };
}

// ── Branch mesh — woody, matte, realistic ───────────────────────────────
function Branch({ seg }: { seg: BranchSeg }) {
  const { position, quaternion, length } = useMemo(() => {
    const mid = seg.start.clone().add(seg.end).multiplyScalar(0.5);
    const dir = seg.end.clone().sub(seg.start);
    const len = dir.length();
    dir.normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir,
    );
    return {
      position: [mid.x, mid.y, mid.z] as [number, number, number],
      quaternion: q,
      length: len,
    };
  }, [seg.start, seg.end]);

  const wood = WOOD_SHADES[Math.min(seg.depth, WOOD_SHADES.length - 1)];

  return (
    <mesh position={position} quaternion={quaternion} castShadow receiveShadow>
      <cylinderGeometry args={[seg.thickness * 0.55, seg.thickness, length, 10]} />
      <meshStandardMaterial
        color={wood}
        roughness={0.85}
        metalness={0.02}
        emissive={WOOD_EMISSIVE}
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

// ── Shard (flower / leaf / coin) ────────────────────────────────────────
function Leaf({
  leaf,
  visible,
  baseGlow,
}: {
  leaf: LeafShard;
  visible: boolean;
  baseGlow: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const centerRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const appear = useRef(0);

  const typeMult =
    leaf.type === "flower" ? 1.35 : leaf.type === "coin" ? 1.2 : 1.0;

  useFrame(({ clock }) => {
    if (!ref.current) return;

    appear.current += ((visible ? 1 : 0) - appear.current) * 0.08;
    const scale = appear.current * leaf.size * typeMult;
    ref.current.scale.setScalar(scale);
    if (centerRef.current) centerRef.current.scale.setScalar(scale * 0.3);

    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const pulse = 0.5 + Math.sin(clock.elapsedTime * 1.4 + leaf.phase) * 0.5;
    mat.emissiveIntensity = baseGlow * (hovered ? 3 : 0.7 + pulse * 0.6);

    if (leaf.type === "coin") {
      ref.current.rotation.y = clock.elapsedTime * 1.1 + leaf.phase;
      ref.current.rotation.x = Math.PI / 2;
    } else if (leaf.type === "flower") {
      // Flowers face outward, breathe gently
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.6 + leaf.phase) * 0.35;
      ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.4 + leaf.phase) * 0.15;
    } else {
      // Leaves flutter
      ref.current.rotation.y = clock.elapsedTime * 0.3 + leaf.phase;
      ref.current.rotation.x =
        Math.sin(clock.elapsedTime * 0.7 + leaf.phase) * 0.4;
    }
  });

  const common = {
    ref,
    position: [leaf.pos.x, leaf.pos.y, leaf.pos.z] as [number, number, number],
    scale: 0,
    onPointerOver: (e: any) => {
      e.stopPropagation();
      setHovered(true);
    },
    onPointerOut: () => setHovered(false),
  };

  if (leaf.type === "flower") {
    return (
      <group>
        <mesh {...common} geometry={getFlowerGeom()} castShadow>
          <meshStandardMaterial
            color={leaf.color}
            emissive={leaf.color}
            emissiveIntensity={baseGlow * 0.6}
            metalness={0.1}
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Stamen (flower center) — small yellow bead */}
        <mesh
          ref={centerRef}
          position={[leaf.pos.x, leaf.pos.y, leaf.pos.z]}
          scale={0}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color={FLOWER_CENTER}
            emissive={FLOWER_CENTER}
            emissiveIntensity={0.8}
            roughness={0.4}
          />
        </mesh>
      </group>
    );
  }

  if (leaf.type === "coin") {
    return (
      <mesh {...common} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.18, 28]} />
        <meshStandardMaterial
          color={COIN_COLOR}
          emissive={COIN_EMISSIVE}
          emissiveIntensity={baseGlow * 0.8}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    );
  }

  // Leaf — slightly flattened octahedron, matte green
  return (
    <mesh
      {...common}
      scale-x={0}
      scale-y={0}
      scale-z={0}
      castShadow
    >
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={leaf.color}
        emissive={leaf.color}
        emissiveIntensity={baseGlow * 0.35}
        metalness={0.05}
        roughness={0.5}
        flatShading
      />
    </mesh>
  );
}

// ── Heartbeat core — a quiet red pulse inside the soil seed ─────────────
function HeartbeatCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 1.6;
    const beat =
      Math.max(0, Math.sin(t) ** 16) + Math.max(0, Math.sin(t - 0.35) ** 16);
    ref.current.scale.setScalar(0.20 + beat * 0.04);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.8 + beat * 2.2;
  });
  return (
    <mesh ref={ref} position={[0, -0.05, 0]}>
      <sphereGeometry args={[1, 18, 18]} />
      <meshStandardMaterial
        color="#fecaca"
        emissive="#ef4444"
        emissiveIntensity={1}
        roughness={0.4}
      />
    </mesh>
  );
}

// ── Pulse rings — subtle ripples in brand colors ────────────────────────
function PulseRings() {
  const r0 = useRef<THREE.Mesh>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const refs = [r0, r1, r2, r3];
  const colors = [
    "#16a34a", // green
    "#ef4444", // red
    "#f59e0b", // gold
    "#3b82f6", // blue
  ];

  useFrame(({ clock }) => {
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      const t = ((clock.elapsedTime + i * 1.0) % 4.0) / 4.0;
      const s = 0.4 + t * 3.6;
      ref.current.scale.set(s, s, 1);
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, (1 - t) * 0.45);
    });
  });

  return (
    <group position={[0, -1.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {refs.map((ref, i) => (
        <mesh key={i} ref={ref}>
          <ringGeometry args={[0.36, 0.42, 64]} />
          <meshBasicMaterial
            color={colors[i]}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Tree root ───────────────────────────────────────────────────────────
function Tree({ growth }: { growth: number }) {
  const rootRef = useRef<THREE.Group>(null);
  const { branches, leaves, totalLeaves } = useMemo(
    () => generateTree(42, 4),
    [],
  );

  useFrame(({ clock }) => {
    if (rootRef.current) {
      rootRef.current.rotation.y = clock.elapsedTime * 0.10;
    }
  });

  const visibleCount = Math.floor(totalLeaves * (0.3 + growth * 0.7));
  const baseGlow = 0.75 + growth * 0.9;

  return (
    <group ref={rootRef} position={[0, -1.6, 0]}>
      {/* Earth / root ball — a rough dark mound */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#3b2316"
          roughness={0.9}
          metalness={0.0}
          emissive="#5a3420"
          emissiveIntensity={0.1}
          flatShading
        />
      </mesh>

      {/* The warm heartbeat inside */}
      <HeartbeatCore />

      {/* Branches */}
      {branches.map((b, i) => (
        <Branch key={i} seg={b} />
      ))}

      {/* Flowers / leaves / coins */}
      {leaves.map((l) => (
        <Leaf
          key={l.birthOrder}
          leaf={l}
          visible={l.birthOrder < visibleCount}
          baseGlow={baseGlow}
        />
      ))}
    </group>
  );
}

// ── Canvas export ───────────────────────────────────────────────────────
export default function TreeOfLife() {
  const campaigns = useStore((s) => s.campaigns);
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
  const growth = Math.min(1, totalRaised / 5_000_000);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1.6, 6.2], fov: 44 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        shadows
      >
        {/* Natural daylight — reads well in light mode, still vivid in dark */}
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[4, 8, 4]}
          intensity={1.6}
          color="#fff2d8"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-4, 4, -3]} intensity={0.45} color="#bae6fd" />

        {/* A hint of warm colored fill for the flowers + leaves */}
        <pointLight position={[0, 2.4, 2]}    intensity={1.2} color="#fde68a" distance={8} />
        <pointLight position={[-2.2, 1.5, -1]} intensity={0.8} color="#86efac" distance={6} />
        <pointLight position={[ 2.2, 1.8, -1]} intensity={0.9} color="#fca5a5" distance={6} />

        <Suspense fallback={null}>
          <Environment preset="park" />

          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
            <Tree growth={growth} />
          </Float>

          <PulseRings />

          {/* Pollen & fairy sparkles — warm + green only, no neon blue */}
          <Sparkles count={45} scale={[7, 6, 7]}   position={[0, 0.8, 0]} size={2.8} speed={0.35} color="#86efac" opacity={0.7} />
          <Sparkles count={35} scale={[6, 5.5, 6]} position={[0, 0.8, 0]} size={2.4} speed={0.3}  color="#fca5a5" opacity={0.7} />
          <Sparkles count={30} scale={[5.5, 5, 5.5]} position={[0, 0.6, 0]} size={2.2} speed={0.25} color="#fcd34d" opacity={0.75} />

          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.45}
            scale={12}
            blur={2.5}
            far={6}
            color="#1f1306"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
