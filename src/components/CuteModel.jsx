// src/components/CuteModel.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import easterRabbit from '../models/Easter_rabbit.glb'; // Import the model file

function Model() {
  const { scene } = useGLTF(easterRabbit); // Use the imported model
  return <primitive object={scene} scale={[2, 2, 2]} />;  // Increase the scale here
}

const CuteModel = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default CuteModel;
