// AnimatedButton.jsx
import React, { useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedButton = ({ children }) => {
  const buttonRef = useRef();

  const handleClick = () => {
    gsap.to(buttonRef.current, {
      scaleX: 1.2,
      scaleY: 0.8,
      yoyo: true,
      repeat: 1,
      duration: 0.2,
      ease: 'power1.inOut',
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      style={{
        fontSize: '1.5em',
        padding: '15px 30px',
        backgroundColor: '#ff6b81',
        border: 'none',
        color: '#fff',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
