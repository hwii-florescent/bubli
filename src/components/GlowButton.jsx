// GlowButton.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px #ff9ff3;
  }
  50% {
    box-shadow: 0 0 20px #f368e0;
  }
  100% {
    box-shadow: 0 0 5px #ff9ff3;
  }
`;

const Button = styled.button`
  background-color: #f368e0;
  color: #fff;
  border: none;
  padding: 15px 30px;
  font-size: 1.2em;
  border-radius: 50px;
  cursor: pointer;
  outline: none;
  transition: box-shadow 0.3s ease;
  &:hover {
    animation: ${glow} 1s infinite;
  }
`;

const GlowButton = ({ children, onClick }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

export default GlowButton;
