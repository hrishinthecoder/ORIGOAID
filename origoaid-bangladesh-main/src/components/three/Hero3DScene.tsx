import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  ContactShadows, 
  Environment,
  PresentationControls,
} from "@react-three/drei";
import * as THREE from "three";

function KineticRing({ radius, speed, rotationAxis, color }: { radius: number, speed: number, rotationAxis: 'x' | 'y' | 'z', color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed;
    if (rotationAxis === 'x') ref.current.rotation.x = t;
    if (rotationAxis === 'y') ref.current.rotation.y = t;
    if (rotationAxis === 'z') ref.current.rotation.z = t;
    
    // Smooth wobble
    ref.current.rotation.y += Math.sin(t * 0.3) * 0.05;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.035, 16, 100]} />
      <meshStandardMaterial 
        color={color} 
        metalness={1} 
        roughness={0.15} 
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function DataShard({ radius, delay }: { radius: number, delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * 0.4 + delay; // Slower shard motion
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 1.2) * 0.3;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.rotation.x = t * 1.5;
    ref.current.rotation.y = t * 2;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.12, 0.12, 0.12]} />
      <meshStandardMaterial 
        color="#10b981" 
        emissive="#10b981" 
        emissiveIntensity={1.5} 
        metalness={1} 
        roughness={0} 
      />
    </mesh>
  );
}

function EngineCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.scale.setScalar(0.8 + Math.sin(state.clock.getElapsedTime() * 4) * 0.03); // Slower, smaller pulse
    }
  });

  return (
    <group scale={0.85}> {/* Shrink the overall system */}
      {/* Central Energy Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981" 
          emissiveIntensity={3} 
          metalness={0.5} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Kinetic Rings - Slower Speeds */}
      <KineticRing radius={1.1} speed={0.8} rotationAxis="x" color="#10b981" />
      <KineticRing radius={1.6} speed={-0.6} rotationAxis="y" color="#064e3b" />
      <KineticRing radius={2.2} speed={0.4} rotationAxis="z" color="#10b981" />
      <KineticRing radius={2.8} speed={-0.3} rotationAxis="x" color="#ffffff" />

      {/* Floating Data Shards */}
      {Array.from({ length: 8 }).map((_, i) => (
        <DataShard key={i} radius={1.3 + Math.random() * 1.4} delay={i * (Math.PI / 4)} />
      ))}
    </group>
  );
}

export default function Hero3DScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ffffff" />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <PresentationControls
            global
            rotation={[0.1, 0.2, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
          >
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
              <EngineCore />
            </Float>
          </PresentationControls>
          
          <ContactShadows 
            position={[0, -3.5, 0]} 
            opacity={0.3} 
            scale={18} 
            blur={2.5} 
            far={10} 
            color="#10b981"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
