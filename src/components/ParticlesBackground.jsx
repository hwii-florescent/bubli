// src/components/ParticlesBackground.jsx
import React from 'react';
import Particles from 'react-tsparticles';

const ParticlesBackground = () => {
  return (
    <Particles
      options={{
        background: {
          color: {
            value: "#f0f8ff", // Light background color
          },
        },
        particles: {
          color: {
            value: "#ff69b4", // Pink particles
          },
          links: {
            color: "#ff69b4",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            outModes: {
              default: "bounce",
            },
          },
          number: {
            value: 50,
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;
