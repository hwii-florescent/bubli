// src/components/CustomCursor.jsx
import React, { useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');

    document.addEventListener('mousemove', e => {
      cursor.setAttribute(
        'style',
        `top: ${e.clientY - 10}px; left: ${e.clientX - 10}px;`
      );
    });
  }, []);

  return <div className="custom-cursor"></div>;
};

export default CustomCursor;
