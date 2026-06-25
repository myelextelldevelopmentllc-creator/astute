import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function GlassSilhouette({ chapterType, landmarkName }: { chapterType: string; landmarkName?: string }) {
  const group = useRef<Mesh>(null);
  const reduced = useReducedMotion();
  const count = useMemo(() => {
    if (chapterType === 'transition') return 7;
    if (landmarkName?.includes('Bridge')) return 5;
    if (landmarkName?.includes('Tunnel')) return 3;
    return 6;
  }, [chapterType, landmarkName]);

  useFrame((state) => {
    if (!group.current || reduced) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.22;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.05;
  });

  return (
    <mesh ref={group} position={[0, -0.3, 0]} rotation={[0.05, -0.4, 0]}>
      {Array.from({ length: count }).map((_, index) => {
        const x = (index - (count - 1) / 2) * 0.26;
        const height = chapterType === 'transition'
          ? 0.35 + (index % 3) * 0.18
          : 0.48 + ((index * 7) % 5) * 0.16;
        return (
          <mesh key={index} position={[x, height / 2, Math.sin(index) * 0.14]}>
            <boxGeometry args={[0.16, height, 0.18]} />
            <meshPhysicalMaterial
              color={index % 2 ? '#9fb8ff' : '#5ee0a1'}
              transparent
              opacity={0.32}
              roughness={0.12}
              metalness={0.08}
              transmission={0.34}
              thickness={0.9}
            />
          </mesh>
        );
      })}
      {landmarkName?.includes('Bridge') && (
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[1.52, 0.05, 0.08]} />
          <meshBasicMaterial color="#d6b66a" transparent opacity={0.42} />
        </mesh>
      )}
    </mesh>
  );
}

export default function Landmark3DOverlay({
  visible,
  chapterType,
  landmarkName,
}: {
  visible: boolean;
  chapterType: string;
  landmarkName?: string;
}) {
  if (!visible) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none', opacity: 0.72 }}>
      <Canvas
        camera={{ position: [0, 0.8, 3.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.4]}
      >
        <ambientLight intensity={1.6} />
        <pointLight position={[2, 2, 3]} intensity={1.9} color="#9fb8ff" />
        <pointLight position={[-2, -1, 2]} intensity={0.9} color="#5ee0a1" />
        <GlassSilhouette chapterType={chapterType} landmarkName={landmarkName} />
      </Canvas>
    </div>
  );
}
