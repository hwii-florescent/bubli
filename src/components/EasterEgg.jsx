// src/components/EasterEgg.jsx
import React, { useState } from 'react';

const EasterEgg = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 === 5) {
      setShowAnimation(true);
    }
  };

  return (
    <div onClick={handleClick} style={{ position: 'relative' }}>
      {showAnimation && (
        <div className="easter-egg-animation">
          {/* Your animation here */}
          <p>Surprise!</p>
        </div>
      )}
    </div>
  );
};

export default EasterEgg;
