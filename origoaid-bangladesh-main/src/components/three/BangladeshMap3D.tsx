import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { DISTRICTS, DIVISION_COLORS, type District } from "@/data/districts";

const LAT_CENTER = 23.9;
const LNG_CENTER = 90.35;
const SCALE = 0.95;

function project(d: District): [number, number] {
  const x = (d.lng - LNG_CENTER) * SCALE;
  const z = -(d.lat - LAT_CENTER) * SCALE;
  return [x, z];
}

const positions = DISTRICTS.map((d) => {
  const [x, z] = project(d);
  return { d, x, z };
});

// Sort districts by distance from Dhaka so the unfolding ripples outward
const dhaka = positions.find((p) => p.d.name === "Dhaka")!;
const ordered = [...positions].sort((a, b) => {
  const da = (a.x - dhaka.x) ** 2 + (a.z - dhaka.z) ** 2;
  const db = (b.x - dhaka.x) ** 2 + (b.z - dhaka.z) ** 2;
  return da - db;
});

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function DistrictPillar({
  d,
  x,
  z,
  delay,
  onHover,
}: {
  d: District;
  x: number;
  z: number;
  delay: number;
  onHover: (d: District | null) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const hovered = useRef(false);
  const color = DIVISION_COLORS[d.division];

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();

    // Phase 1: rise from below with stagger
    const enter = Math.max(0, Math.min(1, (t - delay) / 0.9));
    const eased = easeOutBack(enter);

    // Phase 2: continuous radial wave once settled
    const dist = Math.sqrt((x - dhaka.x) ** 2 + (z - dhaka.z) ** 2);
    const wave = enter >= 1 ? Math.sin(t * 1.4 - dist * 1.2) * 0.06 : 0;

    const baseHeight = 0.18 + (d.name === "Dhaka" ? 0.25 : 0);
    const height = baseHeight * eased + wave;
    const targetScaleY = Math.max(0.001, height / baseHeight);
    ref.current.scale.y += (targetScaleY - ref.current.scale.y) * 0.2;

    const yPos = -1 + eased * 0 + height / 2;
    ref.current.position.y = yPos;

    // Hover pulse
    const target = hovered.current ? 1.6 : 1;
    ref.current.scale.x += (target - ref.current.scale.x) * 0.15;
    ref.current.scale.z += (target - ref.current.scale.z) * 0.15;

    matRef.current.opacity = enter;
    matRef.current.emissiveIntensity = 0.25 + (enter >= 1 ? Math.sin(t * 1.4 - dist * 1.2) * 0.15 : 0);
  });

  const baseHeight = 0.18 + (d.name === "Dhaka" ? 0.25 : 0);
  const radius = d.name === "Dhaka" ? 0.075 : 0.05;

  return (
    <mesh
      ref={ref}
      position={[x, -1, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        hovered.current = true;
        onHover(d);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hovered.current = false;
        onHover(null);
        document.body.style.cursor = "auto";
      }}
    >
      <cylinderGeometry args={[radius, radius, baseHeight, 6]} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.5}
        roughness={0.35}
        transparent
        opacity={0}
      />
    </mesh>
  );
}

function MapBase() {
  // Soft glow plate beneath the country shape
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <circleGeometry args={[3.2, 64]} />
        <meshBasicMaterial color="#1d6fe0" transparent opacity={0.06} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[2.4, 2.42, 128]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.25} />
      </mesh>
    </>
  );
}

function ConnectingLines({ activeName }: { activeName: string | null }) {
  // Lines from Dhaka to all districts when one is hovered, otherwise faint network
  const lines = useMemo(() => {
    return positions
      .filter((p) => p.d.name !== "Dhaka")
      .map((p) => ({
        name: p.d.name,
        from: new THREE.Vector3(dhaka.x, 0.05, dhaka.z),
        to: new THREE.Vector3(p.x, 0.05, p.z),
      }));
  }, []);

  return (
    <group>
      {lines.map((l) => {
        const isActive = activeName === l.name;
        const opacity = isActive ? 0.8 : 0.06;
        const points = [l.from, l.to];
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        return (
          // @ts-expect-error r3f three line element
          <line key={l.name} geometry={geom}>
            <lineBasicMaterial
              color={isActive ? "#22d3ee" : "#3b82f6"}
              transparent
              opacity={opacity}
            />
          </line>
        );
      })}
    </group>
  );
}

function CameraIntro() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const intro = Math.min(1, t / 2.5);
    const eased = easeOutCubic(intro);
    const targetY = 4.2 + (1 - eased) * 6;
    const targetZ = 4.2 + (1 - eased) * 4;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    // gentle drift after intro
    if (intro >= 1) {
      camera.position.x = Math.sin(t * 0.1) * 0.4;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function BangladeshMap3D() {
  const [hovered, setHovered] = useState<District | null>(null);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 10, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 8, 5]} intensity={1.4} />
        <pointLight position={[-4, 3, -3]} intensity={0.8} color="#22d3ee" />
        <pointLight position={[4, 3, 3]} intensity={0.6} color="#60a5fa" />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <MapBase />
          <ConnectingLines activeName={hovered?.name ?? null} />
          {ordered.map((p, i) => (
            <DistrictPillar
              key={p.d.name}
              d={p.d}
              x={p.x}
              z={p.z}
              delay={1.2 + i * 0.04}
              onHover={setHovered}
            />
          ))}
          <CameraIntro />
        </Suspense>
      </Canvas>

      {/* Overlay label */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="glass rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-foreground/70">
          64 districts · 8 divisions
        </div>
        <div
          className={`glass rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {hovered ? (
            <span>
              <span className="text-primary font-bold">{hovered.name}</span>
              <span className="text-muted-foreground"> · {hovered.division}</span>
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
      </div>
    </div>
  );
}
