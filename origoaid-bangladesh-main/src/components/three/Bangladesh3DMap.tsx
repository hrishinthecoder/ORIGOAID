import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    console.error("3D Map Error:", error);
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
          Failed to load 3D map.
        </div>
      );
    }
    return this.props.children;
  }
}

function Model() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}map.glb`);
  const modelRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#138e5d"), // Bangladesh Green
            roughness: 0.2, // Nice glossy finish
            metalness: 0.15,
            envMapIntensity: 2.0, // Make it pop with environment lighting
          });
        }
      });
    }
  }, [scene]);

  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(clock.elapsedTime * 0.65) * 0.18;
    }
  });

  return (
    <group ref={modelRef} rotation={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function Bangladesh3DMap() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 5, 10], fov: 45 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#c8e8ff" />
          <Suspense fallback={null}>
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
              config={{ mass: 2, tension: 400 }}
              snap={{ mass: 4, tension: 400 }}
            >
              <Model />
            </PresentationControls>
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

// Preload might throw if error, so let's put it in try catch or remove it.
// useGLTF.preload("/bangladesh_map.glb");
