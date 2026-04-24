import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Torus,
  Environment,
  Sparkles,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

function Globe() {
  const ref = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.06;
      ref.current.rotation.x += delta * 0.012;
    }
    if (halo.current) halo.current.rotation.y -= delta * 0.02;
  });
  return (
    <Float speed={0.6} floatIntensity={0.18} rotationIntensity={0.08}>
      <group>
        <mesh ref={halo} scale={1.5}>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.045} />
        </mesh>
        <Sphere ref={ref} args={[1.3, 128, 128]}>
          <MeshDistortMaterial
            color="#1d6fe0"
            distort={0.12}
            speed={0.7}
            roughness={0.2}
            metalness={0.5}
            envMapIntensity={1.3}
          />
        </Sphere>
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.55, 0.008, 16, 128]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.45}
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitRing({
  radius,
  count,
  tilt,
  speed,
  size,
  color,
  emissive,
}: {
  radius: number;
  count: number;
  tilt: [number, number, number];
  speed: number;
  size: number;
  color: string;
  emissive: string;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * speed;
  });
  const items = useMemo(
    () => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2),
    [count]
  );
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.0035, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.14} />
      </mesh>
      <group ref={group}>
        {items.map((a, i) => (
          <mesh
            key={i}
            position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
            rotation={[Math.PI / 2, 0, a]}
          >
            <cylinderGeometry args={[size, size, size * 0.22, 32]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={0.25}
              metalness={0.95}
              roughness={0.18}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AccentShapes() {
  return (
    <>
      <Float speed={0.7} floatIntensity={0.5} rotationIntensity={0.3}>
        <mesh position={[2.6, 1.6, -0.8]}>
          <icosahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.7}
            roughness={0.22}
            emissive="#f59e0b"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>
      <Float speed={0.5} floatIntensity={0.4} rotationIntensity={0.4}>
        <Torus args={[0.3, 0.07, 24, 64]} position={[-2.7, -1.1, 0.4]}>
          <meshStandardMaterial color="#0ea5e9" metalness={0.6} roughness={0.28} />
        </Torus>
      </Float>
      <Float speed={0.8} floatIntensity={0.4} rotationIntensity={0.5}>
        <mesh position={[-2.4, 1.7, -0.6]}>
          <dodecahedronGeometry args={[0.22]} />
          <meshStandardMaterial color="#e11d48" metalness={0.6} roughness={0.32} />
        </mesh>
      </Float>
    </>
  );
}

function CameraDrift() {
  const target = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const tx = Math.sin(t * 0.08) * 0.18;
    const ty = Math.cos(t * 0.1) * 0.12;
    camera.position.x += (tx - camera.position.x) * 0.02;
    camera.position.y += (ty - camera.position.y) * 0.02;
    camera.lookAt(target.current);
  });
  return null;
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 5]} intensity={1.3} color="#ffffff" />
        <pointLight position={[-5, -2, -4]} intensity={0.9} color="#f59e0b" />
        <pointLight position={[5, -3, 4]} intensity={0.8} color="#0ea5e9" />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Globe />
          <OrbitRing
            radius={2.1}
            count={6}
            tilt={[0.4, 0, 0.2]}
            speed={0.12}
            size={0.13}
            color="#f59e0b"
            emissive="#f59e0b"
          />
          <OrbitRing
            radius={2.7}
            count={4}
            tilt={[-0.3, 0, -0.4]}
            speed={-0.08}
            size={0.1}
            color="#fcd34d"
            emissive="#f59e0b"
          />
          <AccentShapes />
          <Sparkles count={35} scale={8} size={1.4} speed={0.18} color="#fcd34d" opacity={0.6} />
          <ContactShadows
            position={[0, -1.9, 0]}
            opacity={0.3}
            scale={8}
            blur={2.8}
            far={4}
            color="#1d6fe0"
          />
          <CameraDrift />
        </Suspense>
      </Canvas>
    </div>
  );
}
