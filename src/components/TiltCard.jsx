// src/components/TiltCard.jsx
import React from 'react';
import Tilt from 'react-parallax-tilt';

const TiltCard = () => (
  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
    <div className="tilt-card">
      {/* Content */}
    </div>
  </Tilt>
);

export default TiltCard;
