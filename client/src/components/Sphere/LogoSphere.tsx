import React, { FC, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LogoProps {
  url: string;
  position: [number, number, number];
}

const Logo: FC<LogoProps> = ({ url, position }) => {
  const texture = new THREE.TextureLoader().load(url);
  return (
    <sprite position={position}>
      <spriteMaterial attach="material" map={texture} />
    </sprite>
  );
};

interface LogoSphereProps {
  position: [number, number, number];
}

const LogoSphere: FC<LogoSphereProps> = ({ position }) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotationSpeed = 0.003;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  const logos = [
    './logos/logo1.png',
    './logos/logo2.png',
    './logos/logo3.png',
    './logos/punk.png',
  ];

  const radius = 2;
  const step = (2 * Math.PI) / logos.length;

  return (
    <group ref={groupRef} position={position}>
      {logos.map((logo, index) => {
        const angle = step * index;
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        return <Logo key={index} url={logo} position={[x, 0, z]} />;
      })}
    </group>
  );
};

export default LogoSphere;
