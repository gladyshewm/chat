import React, { useRef, useState, FC, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Cloud,
  Detailed,
  MeshDistortMaterial,
  MeshReflectorMaterial,
  MeshRefractionMaterial,
  MeshWobbleMaterial,
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
import CustomButton from '../buttons/CustomButton/CustomButton';
import PowerIcon from '../../icons/PowerIcon';
import { motion } from 'framer-motion-3d';
import { MotionCanvas, LayoutCamera } from 'framer-motion-3d';

interface GlobeProps {
  position: [number, number, number];
}

const Globe: FC<GlobeProps> = memo(({ position }) => {
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

  /* const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.4 },
  }; */

  const HighDetailGlobe = () => (
    <mesh>
      <sphereGeometry args={[3, 64, 64]} />
      <MeshReflectorMaterial
        ref={meshDistortRef as any}
        mirror={0.5}
        color="#48dd93"
        wireframe
      />
      {/* <MeshWobbleMaterial
        ref={meshDistortRef as any}
        color="#48dd93"
        wireframe
        factor={0.5}
        speed={0.5}
      /> */}
      {/* <MeshDistortMaterial
        ref={meshDistortRef as any}
        speed={0.5}
        color="#48dd93"
        wireframe
        distort={0}
      /> */}
    </mesh>
  );

  const MediumDetailGlobe = () => (
    <mesh>
      <sphereGeometry args={[3, 32, 32]} />
      <MeshDistortMaterial
        ref={meshDistortRef as any}
        speed={0.5}
        color="#48dd93"
        wireframe
      />
    </mesh>
  );

  const LowDetailGlobe = () => (
    <mesh>
      <sphereGeometry args={[3, 16, 16]} />
      <MeshDistortMaterial
        ref={meshDistortRef as any}
        speed={0.5}
        color="#48dd93"
        wireframe
      />
    </mesh>
  );

  return (
    <group
      ref={meshRef as any}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      position={position}
    >
      <Detailed distances={[0, 10, 20]}>
        <HighDetailGlobe />
        <MediumDetailGlobe />
        <LowDetailGlobe />
      </Detailed>
    </group>
  );
});

const Scene = () => {
  const GPUTier = useDetectGPU();
  const [effects, setEffects] = useState(false);

  const killPerformance = () => {
    if (effects) {
      setEffects(false);
    } else {
      setEffects(true);
    }
  };

  return (
    <>
      <CustomButton onClick={() => killPerformance()}>
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
