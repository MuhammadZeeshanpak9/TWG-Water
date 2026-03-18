import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface WaterBottle3DProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

// Water droplet particle - simplified geometry
function WaterDroplet({ position, delay }: { position: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  useFrame((state) => {
    if (!ref.current || !materialRef.current) return;
    const time = state.clock.elapsedTime + delay;
    ref.current.position.y = position[1] - (time % 2) * 0.8;
    ref.current.position.x = position[0] + Math.sin(time * 2) * 0.02;
    ref.current.scale.setScalar(1 - (time % 2) * 0.3);
    materialRef.current.opacity = Math.max(0, 1 - (time % 2) * 0.8);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#9f81b9"
        transmission={0.9}
        opacity={0.8}
        transparent
        roughness={0}
        metalness={0}
        ior={1.33}
        thickness={0.05}
      />
    </mesh>
  );
}

// Floating particles - simplified
function FloatingParticle({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(time) * 0.1;
    ref.current.position.x = position[0] + Math.cos(time * 0.7) * 0.05;
    ref.current.position.z = position[2] + Math.sin(time * 0.5) * 0.03;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.008, 4, 4]} />
      <meshBasicMaterial color="#9f81b9" opacity={0.4} transparent />
    </mesh>
  );
}

export default function WaterBottle3D({ 
  position = [0, 0, 0], 
  scale = 1,
  rotation = [0, 0, 0]
}: WaterBottle3DProps) {
  const bottleRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  
  const droplets = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      position: [0.08 + Math.random() * 0.04, 0.35 - Math.random() * 0.1, 0] as [number, number, number],
      delay: i * 0.5,
    }));
  }, []);
  
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      position: [
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 0.5,
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (waterRef.current) {
      const time = state.clock.elapsedTime;
      waterRef.current.position.y = -0.1 + Math.sin(time * 0.5) * 0.01;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={bottleRef} scale={scale}>
          {/* Bottle outer glass - optimized with MeshPhysicalMaterial */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.7, 16, 1, true]} />
            <meshPhysicalMaterial
              transparent
              opacity={0.3}
              transmission={0.95}
              thickness={0.1}
              roughness={0.05}
              metalness={0.05}
              color="#ffffff"
              ior={1.45}
            />
          </mesh>
          
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.02, 16]} />
            <meshPhysicalMaterial
              transparent
              opacity={0.4}
              transmission={0.9}
              roughness={0.05}
              color="#ffffff"
            />
          </mesh>
          
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
          </mesh>
          
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.02, 16]} />
            <meshStandardMaterial color="#a0a0a0" metalness={0.7} roughness={0.25} />
          </mesh>
          
          <mesh ref={waterRef} position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.45, 16]} />
            <meshPhysicalMaterial
              color="#9f81b9"
              transmission={0.7}
              opacity={0.5}
              transparent
              roughness={0.1}
              ior={1.33}
            />
          </mesh>
          
          <mesh position={[0, 0.125, 0]}>
            <circleGeometry args={[0.105, 16]} />
            <meshPhysicalMaterial color="#c4a8d8" transmission={0.9} opacity={0.4} transparent ior={1.33} />
          </mesh>
          
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 0.15,
                -0.25 + Math.random() * 0.3,
                (Math.random() - 0.5) * 0.15,
              ]}
            >
              <sphereGeometry args={[0.008 + Math.random() * 0.008, 4, 4]} />
              <meshBasicMaterial color="#ffffff" opacity={0.2} transparent />
            </mesh>
          ))}
          
          <mesh position={[0, -0.05, 0.115]}>
            <planeGeometry args={[0.15, 0.2]} />
            <meshStandardMaterial color="#f3eff8" transparent opacity={0.85} />
          </mesh>
          
          <mesh position={[0, -0.02, 0.12]}>
            <planeGeometry args={[0.1, 0.02]} />
            <meshStandardMaterial color="#9f81b9" />
          </mesh>
        </group>
      </Float>
      
      {droplets.map((droplet, i) => (
        <WaterDroplet key={i} position={droplet.position} delay={droplet.delay} />
      ))}
      
      {particles.map((particle, i) => (
        <FloatingParticle key={i} position={particle.position} speed={particle.speed} />
      ))}
      
      <Environment preset="city" />
    </group>
  );
}
