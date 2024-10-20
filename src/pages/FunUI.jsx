// src/pages/FunUI.jsx
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import CursorTrail from '../components/CursorTrail';
import mashyImage from '../assets/mashy.png';
import sheepImage from '../assets/sheep.png';
import catImage from '../assets/cat.png';
import { gsap } from 'gsap'; // For animations
import confetti from 'canvas-confetti'; // For particle effect

const FunUI = () => {
  // State and hooks
  const [mouseX, setMouseX] = useState(0);
  const [sunColor, setSunColor] = useState('#FFD700');
  const [balloons, setBalloons] = useState([
    { x: 100, y: 600, color: '#FF69B4' },
    { x: 300, y: 650, color: '#FF8C00' },
    { x: 500, y: 700, color: '#8A2BE2' },
  ]);
  const [birds, setBirds] = useState([
    { x: 800, y: 100, direction: -1 },
    { x: 0, y: 200, direction: 1 },
  ]);

  // Mouse movement handler for cloud movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Balloons floating upwards
  useEffect(() => {
    const moveBalloons = () => {
      setBalloons((prevBalloons) =>
        prevBalloons.map((balloon) => ({
          ...balloon,
          y: balloon.y < -50 ? 600 : balloon.y - 0.7,
        }))
      );
    };

    const interval = setInterval(moveBalloons, 30);
    return () => clearInterval(interval);
  }, []);

  // Birds flying across the screen
  useEffect(() => {
    const moveBirds = () => {
      setBirds((prevBirds) =>
        prevBirds.map((bird) => ({
          ...bird,
          x:
            bird.direction === -1 && bird.x < -50
              ? 850
              : bird.direction === 1 && bird.x > 850
              ? -50
              : bird.x + bird.direction * 2,
        }))
      );
    };

    const interval = setInterval(moveBirds, 30);
    return () => clearInterval(interval);
  }, []);

  // Handle sun click to change color
  const handleSunClick = () => {
    const colors = ['#FFD700', '#FFA500', '#FF4500', '#FF8C00', '#FFFF00'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSunColor(randomColor);
  };

  // Calculate cloud position based on mouse movement
  const cloudPosition = (offset) => {
    return (mouseX / window.innerWidth) * 100 + offset;
  };

  // Animation for animal images
  const handleAnimalClick = (id) => {
    if (id === 'mashyImage') {
      // Trigger particle effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      // For other animals, use GSAP animation
      gsap.to(`#${id}`, {
        scaleX: 1.2,
        scaleY: 0.8,
        yoyo: true,
        repeat: 1,
        duration: 0.2,
        ease: 'power1.inOut',
      });
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Cursor Trail */}
      <CursorTrail />

      {/* SVG Scene */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        {/* Sky Gradient */}
        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#87CEFA" />
          </linearGradient>

          {/* Sun Gradient */}
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF700" />
            <stop offset="100%" stopColor="#FF4500" />
          </radialGradient>

          {/* Glow Effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="800" height="600" fill="url(#skyGradient)" />

        {/* Draggable Sun */}
        <Draggable>
          <circle
            className="sun"
            cx="400"
            cy="100"
            r="60"
            fill="url(#sunGradient)"
            onClick={handleSunClick}
            style={{ cursor: 'pointer', filter: 'url(#glow)' }}
          />
        </Draggable>

        {/* Sun Rays */}
        {[...Array(20)].map((_, i) => (
          <line
            key={i}
            className="sun-ray"
            x1="400"
            y1="100"
            x2="400"
            y2="0"
            stroke={sunColor}
            strokeWidth="4"
            transform={`rotate(${i * 18}, 400, 100)`}
            style={{ opacity: 0.7 }}
          />
        ))}

        {/* Draggable Clouds */}
        {[0, -200].map((offset, index) => (
          <Draggable key={index}>
            <g
              className="cloud"
              transform={`translate(${cloudPosition(offset)}, ${
                150 + index * 100
              })`}
            >
              <ellipse cx="100" cy="50" rx="60" ry="30" fill="#fff" />
              <ellipse cx="140" cy="50" rx="50" ry="25" fill="#fff" />
              <ellipse cx="120" cy="70" rx="50" ry="25" fill="#fff" />
            </g>
          </Draggable>
        ))}

        {/* Balloons */}
        {balloons.map((balloon, index) => (
          <g
            key={index}
            className="balloon"
            transform={`translate(${balloon.x}, ${balloon.y})`}
          >
            <line x1="0" y1="0" x2="0" y2="30" stroke="#555" />
            <ellipse cx="0" cy="0" rx="15" ry="20" fill={balloon.color} />
          </g>
        ))}

        {/* Birds */}
        {birds.map((bird, index) => (
          <g
            key={index}
            className="bird"
            transform={`translate(${bird.x}, ${bird.y}) scale(${bird.direction},1)`}
          >
            <path
              d="M0 0 C 10 -10, 20 -10, 30 0"
              stroke="#000"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 0 C 10 10, 20 10, 30 0"
              stroke="#000"
              strokeWidth="2"
              fill="none"
            />
          </g>
        ))}

        {/* Grass Patch */}
        <rect x="0" y="500" width="800" height="100" fill="#228B22" />

        {/* Animals */}
        {/* Positions adjusted to spread them out */}
        <image
          href={mashyImage}
          x="100"
          y="450"
          height="50"
          width="50"
          id="mashyImage"
          style={{ cursor: 'pointer' }}
          onClick={() => handleAnimalClick('mashyImage')}
        />
        <image
          href={sheepImage}
          x="350"
          y="460"
          height="50"
          width="50"
          id="sheepImage"
          style={{ cursor: 'pointer' }}
          onClick={() => handleAnimalClick('sheepImage')}
        />
        <image
          href={catImage}
          x="600"
          y="450"
          height="50"
          width="50"
          id="catImage"
          style={{ cursor: 'pointer' }}
          onClick={() => handleAnimalClick('catImage')}
        />
      </svg>

      {/* Draggable Sticky Notes */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      >
        <Draggable>
          <div
            style={{
              width: '150px',
              height: '150px',
              backgroundColor: 'yellow',
              padding: '10px',
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              border: '1px solid #ccc',
              borderRadius: '10px',
              position: 'absolute',
              top: '50px',
              left: '50px',
              cursor: 'move',
            }}
          >
            You are valuable
          </div>
        </Draggable>

        <Draggable>
          <div
            style={{
              width: '150px',
              height: '150px',
              backgroundColor: 'yellow',
              padding: '10px',
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              border: '1px solid #ccc',
              borderRadius: '10px',
              position: 'absolute',
              top: '200px',
              left: '200px',
              cursor: 'move',
            }}
          >
            You deserve to be where you are
          </div>
        </Draggable>

        <Draggable>
          <div
            style={{
              width: '150px',
              height: '150px',
              backgroundColor: 'yellow',
              padding: '10px',
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              border: '1px solid #ccc',
              borderRadius: '10px',
              position: 'absolute',
              top: '350px',
              left: '100px',
              cursor: 'move',
            }}
          >
            You are the sunshine of someone's day
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default FunUI;
