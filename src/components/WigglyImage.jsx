// WigglyImage.jsx
import React, { Component } from 'react';
import { motion } from 'framer-motion';

class WigglyImage extends Component {
  render() {
    const {
      src,
      alt,
      style = {},
      hoverEffect = {
        rotate: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.4 },
      },
      tapEffect = { scale: 0.95 },
    } = this.props;

    return (
      <motion.img
        src={src}
        alt={alt}
        style={{ cursor: 'pointer', ...style }}
        whileHover={hoverEffect}
        whileTap={tapEffect}
      />
    );
  }
}

export default WigglyImage;
