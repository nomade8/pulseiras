import React from 'react';
import { IconProps } from '../../types';

const StarIcon: React.FC<IconProps> = ({ className, color = 'currentColor', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color} 
    className={className}
    // Removed style={{ transform: scale(...) }}
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

export default StarIcon;