"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef, useEffect } from "react";

const Background = ({ texturePath }: { texturePath: string }) => {
  const texture = useTexture(texturePath);
  const ref = useRef<THREE.Mesh | null>(null);
  const { viewport } = useThree();

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (ref.current.material instanceof THREE.MeshBasicMaterial) {
      ref.current.material.map?.offset.add(new THREE.Vector2(delta * 0.01, delta * 0.01));
    }
  });

  useEffect(() => {
    if (ref.current && texture.image) {
      const imageAspect = texture.image.width / texture.image.height;
      const viewportAspect = viewport.width / viewport.height;
      
      let scaleX, scaleY;
      
      if (viewportAspect > imageAspect) {
        scaleX = viewport.width;
        scaleY = viewport.width / imageAspect;
      } else {
        scaleX = viewport.height * imageAspect;
        scaleY = viewport.height;
      }
      
      ref.current.scale.set(scaleX, scaleY, 1);
    }
  }, [viewport.width, viewport.height, texture]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const AnimatedBackground = ({ texturePath }: { texturePath: string }) => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <Background texturePath={texturePath} />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
