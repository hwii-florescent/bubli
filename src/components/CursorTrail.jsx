// src/components/CursorTrail.js
import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
  const numDots = 30;
  const dotRefs = useRef([]);
  const positions = useRef(Array.from({ length: numDots }, () => ({ x: 0, y: 0 })));

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;

    const animate = () => {
      positions.current[0] = { x: mouseX, y: mouseY };

      for (let i = 1; i < numDots; i++) {
        const prev = positions.current[i - 1];
        const curr = positions.current[i];

        positions.current[i] = {
          x: prev.x + (curr.x - prev.x) * 0.3,
          y: prev.y + (curr.y - prev.y) * 0.3,
        };
      }

      dotRefs.current.forEach((dot, index) => {
        if (dot) {
          const pos = positions.current[index];
          dot.style.left = pos.x + 'px';
          dot.style.top = pos.y + 'px';
          dot.style.transform = `translate(-50%, -50%) scale(${1 - index * 0.03})`;
          dot.style.opacity = `${1 - index * 0.03}`;
          dot.style.zIndex = '1000'; // Added zIndex to ensure dots are on top
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Colors for rainbow effect
  const colors = ['#FF3F34', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55'];

  return (
    <>
      {Array.from({ length: numDots }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (dotRefs.current[index] = el)}
          style={{
            position: 'fixed',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            pointerEvents: 'none',
            background: colors[index % colors.length],
            opacity: 1 - index * 0.03,
            transform: `translate(-50%, -50%) scale(${1 - index * 0.03})`,
            left: '0px',
            top: '0px',
            zIndex: 1000, // Added zIndex here
          }}
        ></div>
      ))}
    </>
  );
};

export default CursorTrail;
