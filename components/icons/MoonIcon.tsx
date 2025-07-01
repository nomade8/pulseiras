import React from 'react';
import { IconProps } from '../../types';

const MoonIcon: React.FC<IconProps> = ({ className, color = 'currentColor', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color} 
    className={className}
    // Removed style={{ transform: scale(...) }}
  >
    <path d="M12.38 2.03c.38-.21.83-.21 1.21 0C18.42 4.19 22 8.79 22 14c0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.7 3.05-8.94 7.38-11.97zM11 14.5c0 3.03 2.47 5.5 5.5 5.5.07 0 .14 0 .2-.01C14.16 19.34 12 17.06 12 14.5s-2.16-4.84-4.7-4.15c.01.06.01.13.01.2 0 3.03 2.47 5.5 5.5 5.5z"/>
  </svg>
);

export default MoonIcon;