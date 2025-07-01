import React from 'react';
import { IconProps } from '../../types';

const LetterIcon: React.FC<IconProps> = ({ 
  className, 
  color = 'currentColor', 
  size, 
  char = 'A' 
}) => (
  <svg 
    viewBox="0 0 24 24" // Keep viewBox to define coordinate system
    width={size} 
    height={size} 
    // fill is not used for the SVG itself, but for the text element
    className={className}
    style={{ 
      // transform: scale removed
      border: '1px solid #ccc', 
      borderRadius: '4px',
      backgroundColor: 'white'
    }}
  >
    <text 
      x="50%" 
      y="50%" 
      dominantBaseline="middle" 
      textAnchor="middle" 
      fontSize={size * 0.65 + 'px'} // Dynamic font size based on prop
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
      fill={color} // This is the text color
    >
      {char}
    </text>
  </svg>
);

export default LetterIcon;