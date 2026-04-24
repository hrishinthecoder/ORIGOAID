import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, useTexture, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  height?: string | number;
  width?: string | number;
}

/**
 * Realistic Earth Globe using High-Resolution Blue Marble Texture
 */
const Globe = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // High-resolution Blue Marble texture for realistic topography and oceans
  const texture = useTexture('https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg');

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002; // Slow, smooth auto-rotation
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial 
        map={texture} 
        roughness={0.7} 
        metalness={0.1}
      />
    </Sphere>
  );
};

/**
 * Modern Interactive 3D Globe Component
 * Strictly minimalist and clean implementation
 */
export default function InteractiveGlobe({ height = '500px', width = '100%' }: GlobeProps) {
  return (
    <div style={{ height, width, background: 'transparent' }}>
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        
        <Suspense fallback={<mesh><sphereGeometry args={[2, 32, 32]} /><meshStandardMaterial color="#012a1a" /></mesh>}>
          <Globe />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    </div>
  );
}
