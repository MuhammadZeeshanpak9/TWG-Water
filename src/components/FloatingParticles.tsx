import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
}

export default function FloatingParticles({
  count = 50,
  color = '#9f81b9',
  size = 0.02,
  spread = 5,
}: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * spread;
      pos[i3 + 1] = (Math.random() - 0.5) * spread;
      pos[i3 + 2] = (Math.random() - 0.5) * spread * 0.5;
      
      vel[i3] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    
    return [pos, vel];
  }, [count, spread]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply gentle floating motion
      posArray[i3] += velocities[i3] + Math.sin(time * 0.5 + i) * 0.0005;
      posArray[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.3 + i) * 0.0005;
      posArray[i3 + 2] += velocities[i3 + 2];
      
      // Boundary wrapping
      if (posArray[i3] > spread / 2) posArray[i3] = -spread / 2;
      if (posArray[i3] < -spread / 2) posArray[i3] = spread / 2;
      if (posArray[i3 + 1] > spread / 2) posArray[i3 + 1] = -spread / 2;
      if (posArray[i3 + 1] < -spread / 2) posArray[i3 + 1] = spread / 2;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
