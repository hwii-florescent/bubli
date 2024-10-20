// WigglyButton.jsx
import React, { Component } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const StyledButton = styled(motion.button)`
  background-color: ${(props) => props.bgColor || '#ff6f61'};
  color: #fff;
  border: none;
  padding: 15px 30px;
  font-size: 1.2em;
  border-radius: 50px;
  cursor: pointer;
  outline: none;
`;

class WigglyButton extends Component {
  render() {
    const {
      children,
      onClick,
      bgColor,
      hoverEffect = {
        rotate: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.4 },
      },
      tapEffect = { scale: 0.95 },
    } = this.props;

    return (
      <StyledButton
        onClick={onClick}
        whileHover={hoverEffect}
        whileTap={tapEffect}
        bgColor={bgColor}
      >
        {children}
      </StyledButton>
    );
  }
}

export default WigglyButton;
