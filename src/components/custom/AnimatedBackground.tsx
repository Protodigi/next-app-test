"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef } from "react";

const Background = ({ texturePath }: { texturePath: string }) => {
  const texture = useTexture(texturePath);
  const ref = useRef<THREE.Mesh | null>(null);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (ref.current.material instanceof THREE.MeshBasicMaterial) {
      ref.current.material.map?.offset.add(new THREE.Vector2(delta * 0.01, delta * 0.01));
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const AnimatedBackground = ({ texturePath }: { texturePath: string }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Canvas>
        <Background texturePath={texturePath} />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
