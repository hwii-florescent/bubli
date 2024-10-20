// AnimatedImage.jsx
import React, { Component, createRef } from 'react';
import { gsap } from 'gsap';

class AnimatedImage extends Component {
  constructor(props) {
    super(props);
    this.imageRef = createRef();
  }

  handleClick = () => {
    const { animationConfig } = this.props;

    gsap.to(this.imageRef.current, {
      scaleX: 1.2,
      scaleY: 0.8,
      yoyo: true,
      repeat: 1,
      duration: 0.2,
      ease: 'power1.inOut',
      ...animationConfig,
    });
  };

  render() {
    const { src, alt, style = {} } = this.props;

    return (
      <img
        ref={this.imageRef}
        src={src}
        alt={alt}
        onClick={this.handleClick}
        style={{ cursor: 'pointer', ...style }}
      />
    );
  }
}

export default AnimatedImage;
