import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Coins({ count = 40 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 8 + 4,
        z: (Math.random() - 0.5) * 6,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        speed: 0.6 + Math.random() * 1.4,
        spin: (Math.random() - 0.5) * 3,
      })),
    [count]
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    data.forEach((d, i) => {
      d.y -= d.speed * delta;
      d.rx += d.spin * delta;
      d.ry += d.spin * delta * 0.7;
      if (d.y < -5) {
        d.y = 6 + Math.random() * 3;
        d.x = (Math.random() - 0.5) * 10;
      }
      dummy.position.set(d.x, d.y, d.z);
      dummy.rotation.set(d.rx, d.ry, 0);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.14, 0.14, 0.03, 24]} />
      <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.15} />
    </instancedMesh>
  );
}

export default function CoinShower() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 4]} intensity={1.1} />
        <Suspense fallback={null}>
          <Coins />
        </Suspense>
      </Canvas>
    </div>
  );
}
