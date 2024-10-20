// src/components/InteractiveParticles.jsx
import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const InteractiveParticles = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        particles: {
          number: {
            value: 50,
          },
          color: {
            value: '#ff9ff3',
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: 0.7,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
            },
          },
          size: {
            value: 5,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
            },
          },
          move: {
            enable: true,
            speed: 2,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            onClick: {
              enable: true,
              mode: 'push',
            },
          },
          modes: {
            repulse: {
              distance: 100,
            },
            push: {
              particles_nb: 4,
            },
          },
        },
      }}
      style={{
        position: 'fixed',
        zIndex: -1,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default InteractiveParticles;
