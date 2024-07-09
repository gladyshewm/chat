import React, { useRef, useState, FC } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Cloud,
  MeshDistortMaterial,
  OrbitControls,
  Stars,
  useDetectGPU,
} from '@react-three/drei';
import {
  Bloom,
  Noise,
  Vignette,
  EffectComposer,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import LogoSphere from './LogoSphere';
import CustomButton from '../CustomButton/CustomButton';
import PowerIcon from '../icons/PowerIcon';

interface GlobeProps {
  position: [number, number, number];
}

const Globe: FC<GlobeProps> = ({ position }) => {
  const [hovered, hover] = useState(false);
  const meshDistortRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationSpeed = 0.003;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  useFrame(() => {
    if (meshDistortRef.current) {
      (meshDistortRef.current as any).distort = THREE.MathUtils.lerp(
        (meshDistortRef.current as any).distort,
        hovered ? 0.3 : 0,
        hovered ? 0.05 : 0.01,
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      position={position}
    >
      <sphereGeometry args={[3, 26, 22]} />
      <MeshDistortMaterial
        ref={meshDistortRef as any}
        speed={0.5}
        color="#48dd93"
        wireframe
      />
    </mesh>
  );
};

const Scene = () => {
  const GPUTier = useDetectGPU();
  const [effects, setEffects] = useState(false);

  const killPerfomance = () => {
    if (effects) {
      setEffects(false);
    } else {
      setEffects(true);
    }
  };

  return (
    <>
      <CustomButton onClick={() => killPerfomance()}>
        <PowerIcon />
      </CustomButton>
      <Canvas gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        <Globe position={[1.5, 0, 0]} />
        <LogoSphere position={[1.5, 0, 0]} />
        <OrbitControls
          maxDistance={200}
          enableDamping={true}
          dampingFactor={0.2}
          rotateSpeed={0.1}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        {effects && (
          <EffectComposer enabled={!(GPUTier.tier === 0 || GPUTier.isMobile)}>
            <Bloom
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              height={300}
            />
            <Noise opacity={0.01} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        )}

        <Cloud seed={1} scale={2} volume={0} color="#378f7b" fade={130} />
      </Canvas>
    </>
  );
};

export default Scene;
