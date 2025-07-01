import React from 'react';
import { IconProps } from '../../types';

const EvilEyeIcon: React.FC<IconProps> = ({ className, color = '#4285F4', size }) => (
  <svg 
    viewBox="0 0 60 36" 
    width={size * (60/36)} // Adjust width to maintain aspect ratio
    height={size} 
    className={className}
    // Removed style={{ transform: scale(...) }}
  >
    <ellipse cx="30" cy="18" rx="28" ry="17" fill={color} stroke="#FFFFFF" strokeWidth="1"/>
    <ellipse cx="30" cy="18" rx="20" ry="12" fill="#FFFFFF"/>
    <ellipse cx="30" cy="18" rx="12" ry="7" fill="#00BFFF"/> {/* Light blue */}
    <circle cx="30" cy="18" r="4" fill="#000000"/>
  </svg>
);

export default EvilEyeIcon;