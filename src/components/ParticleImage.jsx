// ParticleImage.jsx
import React, { Component } from 'react';
import confetti from 'canvas-confetti';

class ParticleImage extends Component {
  handleClick = () => {
    const { confettiConfig } = this.props;

    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
      ...confettiConfig,
    });
  };

  render() {
    const { src, alt, style = {} } = this.props;

    return (
      <img
        src={src}
        alt={alt}
        onClick={this.handleClick}
        style={{ cursor: 'pointer', ...style }}
      />
    );
  }
}

export default ParticleImage;
