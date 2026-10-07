import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus, Float, MeshDistortMaterial } from '@react-three/drei';

// Floating medical cross
const MedicalCross = ({ position, scale = 1, speed = 1 }) => {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Vertical bar */}
      <Box args={[0.2, 0.7, 0.1]}>
        <meshStandardMaterial color="#0ea5e9" metalness={0.3} roughness={0.2} />
      </Box>
      {/* Horizontal bar */}
      <Box args={[0.7, 0.2, 0.1]}>
        <meshStandardMaterial color="#0ea5e9" metalness={0.3} roughness={0.2} />
      </Box>
    </group>
  );
};

// Pulsing orb
const PulsingOrb = ({ position, color = '#38bdf8', speed = 1 }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * speed * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[0.3, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          distort={0.3}
          speed={2}
          metalness={0.5}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
};

// DNA helix ring
const HelixRing = ({ position, speed = 0.5 }) => {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * speed;
      groupRef.current.rotation.y = state.clock.elapsedTime * speed * 0.7;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Torus args={[0.5, 0.05, 16, 100]}>
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.1} />
      </Torus>
      <Torus args={[0.5, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#38bdf8" metalness={0.6} roughness={0.1} />
      </Torus>
    </group>
  );
};

// Ambulance cube (simplified)
const AmbulanceCube = ({ position }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <Box ref={meshRef} args={[0.5, 0.3, 0.7]} position={position}>
      <meshStandardMaterial color="#0369a1" metalness={0.4} roughness={0.3} />
    </Box>
  );
};

// Main Hero Canvas
const HeroScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#0ea5e9" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#38bdf8" />
      <directionalLight position={[0, 8, 4]} intensity={1} color="#ffffff" />
      <directionalLight position={[-4, -4, 2]} intensity={0.4} color="#bae6fd" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
        <MedicalCross position={[-2, 1, 0]} scale={1.2} speed={0.8} />
      </Float>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
        <MedicalCross position={[2.5, -0.5, -1]} scale={0.7} speed={1.2} />
      </Float>

      <PulsingOrb position={[1.5, 1.5, -0.5]} color="#0ea5e9" speed={1} />
      <PulsingOrb position={[-1.5, -1, 0.5]} color="#38bdf8" speed={0.7} />
      <PulsingOrb position={[0, 2, -1]} color="#0284c7" speed={1.3} />

      <HelixRing position={[-2.5, -1.5, 0]} speed={0.4} />
      <HelixRing position={[3, 1, -2]} speed={0.6} />

      <AmbulanceCube position={[0, -1.5, 1]} />
    </Canvas>
  );
};

export default HeroScene;
