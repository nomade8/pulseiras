import React from 'react';
import { IconProps } from '../../types';

const BeadIcon: React.FC<IconProps> = ({ className, color = 'currentColor', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color} 
    className={className}
    // Removed style={{ transform: scale(...) }}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export default BeadIcon;