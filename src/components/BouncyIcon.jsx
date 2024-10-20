// BouncyIcon.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';

const IconWrapper = styled(motion.div)`
  display: inline-block;
  font-size: 2em;
  color: #f1c40f;
  cursor: pointer;
`;

const BouncyIcon = () => {
  return (
    <IconWrapper
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <FaStar />
    </IconWrapper>
  );
};

export default BouncyIcon;
