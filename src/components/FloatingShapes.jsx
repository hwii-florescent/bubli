// FloatingShapes.js
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Shape = styled(motion.div)`
  position: absolute;
  background-color: ${({ color }) => color};
  border-radius: 50%;
`;

const colors = ['#ff7675', '#74b9ff', '#ffeaa7', '#a29bfe'];

const FloatingShapes = () => {
  const shapes = Array.from({ length: 20 }).map((_, index) => ({
    size: Math.random() * 50 + 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    delay: Math.random() * 5,
  }));

  return (
    <>
      {shapes.map((shape, index) => (
        <Shape
          key={index}
          color={shape.color}
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.y,
            left: shape.x,
          }}
          animate={{ y: [shape.y, shape.y - 100, shape.y] }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: shape.delay,
          }}
        />
      ))}
    </>
  );
};

export default FloatingShapes;
