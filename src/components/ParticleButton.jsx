// ParticleButton.jsx
import React, { Component } from 'react';
import confetti from 'canvas-confetti';

class ParticleButton extends Component {
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
    const { children, style = {} } = this.props;

    return (
      <button
        onClick={this.handleClick}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          cursor: 'pointer',
          backgroundColor: '#FF69B4',
          border: 'none',
          color: '#fff',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          transition: 'background-color 0.3s ease',
          ...style,
        }}
      >
        {children}
      </button>
    );
  }
}

export default ParticleButton;
