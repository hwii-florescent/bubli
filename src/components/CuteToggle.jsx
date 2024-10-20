// src/components/CuteToggle.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  width: 80px;
  height: 40px;
  background-color: ${({ $isOn }) => ($isOn ? '#55efc4' : '#dfe6e9')};  // Use $isOn
  border-radius: 40px;
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
`;

const ToggleCircle = styled.div`
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
  transform: ${({ $isOn }) => ($isOn ? 'translateX(40px)' : 'translateX(0)')};  // Use $isOn
`;

const CuteToggle = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <ToggleContainer $isOn={isOn} onClick={() => setIsOn(!isOn)}>
      <ToggleCircle $isOn={isOn} />
    </ToggleContainer>
  );
};

export default CuteToggle;
