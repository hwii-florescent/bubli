// src/components/AnimatedCharacter.jsx
import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../animations/cute-character.json';

const AnimatedCharacter = () => {
  return (
    <Lottie animationData={animationData} loop={true} />
  );
};

export default AnimatedCharacter;
