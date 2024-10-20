// src/components/ParallaxBackground.jsx
import React from 'react';
import { Parallax } from 'react-parallax';

const ParallaxBackground = () => (
  <div>
    {/* Background Layer 1 */}
    <Parallax
      bgImage={require('../assets/pexels-michaela-st-3448542-20704974.png')}
      strength={400}  // Increased parallax strength for more depth
    >
      <div style={{ height: 600, position: 'relative' }}>  {/* Increased height */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',  // Darker overlay for better text contrast
          }}
        />
        <h1
          style={{
            color: '#ffffff',
            fontSize: '4em',  // Larger font size
            fontWeight: 'bold',  // Bold text for better readability
            textAlign: 'center',
            paddingTop: '250px',
            textShadow: '4px 4px 12px rgba(0, 0, 0, 0.8)',  // Stronger shadow for more clarity
          }}
        >
          Welcome to the Fun UI!
        </h1>
      </div>
    </Parallax>

    {/* Background Layer 2 */}
    <Parallax
      bgImage={require('../assets/pexels-moose-photos-170195-1037995.png')}
      strength={150}  // Increased parallax strength
    >
      <div style={{ height: 600, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.6)',  // Lighter overlay but with higher opacity
          }}
        />
        <h2
          style={{
            color: '#333',
            fontSize: '3em',  // Larger font size
            fontWeight: 'bold',  // Bold text
            textAlign: 'center',
            paddingTop: '250px',
            textShadow: '3px 3px 8px rgba(255, 255, 255, 0.8)',  // Text shadow for visibility
          }}
        >
          Dive Deeper!
        </h2>
      </div>
    </Parallax>
    
    {/* Additional Parallax Layer for Extra Depth */}
    <Parallax
      bgImage={require('../assets/pexels-jess-bailey-2328923.png')}  // Another image for more depth
      strength={200}
    >
      <div style={{ height: 600 }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',  // Darker overlay for higher contrast
          }}
        />
        <h2
          style={{
            color: '#fff',
            fontSize: '3em',  // Larger font size
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: '250px',
            textShadow: '3px 3px 10px rgba(0, 0, 0, 0.9)',  // Strong shadow for text clarity
          }}
        >
          Explore More Layers
        </h2>
      </div>
    </Parallax>
  </div>
);

export default ParallaxBackground;
