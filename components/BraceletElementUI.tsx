import React from 'react';
import { BraceletElementItem, ElementType, IconProps } from '../types'; // ELEMENT_BASE_SIZE_PX removed from here
import LetterIcon from './icons/LetterIcon'; 

interface BraceletElementUIProps {
  // Use a simplified element structure for palette items, or full for design area
  element: Pick<BraceletElementItem, 'icon' | 'color' | 'letter' | 'type' | 'name' | 'id'>;
  size: number; // This will be the new ELEMENT_BASE_SIZE_PX or a derivative
  isSelected?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  draggable?: boolean;
}

const BraceletElementUI: React.FC<BraceletElementUIProps> = ({
  element,
  size, // Direct size prop
  isSelected = false,
  onClick,
  onDragStart,
  draggable = false,
}) => {
  const IconComponent = element.icon;
  // displaySize is now simply the 'size' prop
  const displaySize = size;

  const isLetterSequence = element.type === ElementType.LETTER && element.letter && element.letter.length > 0;

  const style: React.CSSProperties = {
    height: `${displaySize}px`,
    cursor: onClick ? 'pointer' : draggable ? 'grab' : 'default',
    border: isSelected ? '2px solid #007bff' : '2px solid transparent',
    display: 'inline-flex', // Changed from 'flex' to 'inline-flex' for better flow with other elements if needed
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px', // Minimal padding, size is king
    boxSizing: 'border-box',
    touchAction: 'none',
    gap: isLetterSequence ? Math.max(1, Math.floor(displaySize * 0.05)) + 'px' : undefined, // Spacing between letters, proportional
  };
  
  if (element.type === ElementType.LETTER) {
    style.borderRadius = '4px'; 
    if (isLetterSequence) {
      style.paddingLeft = Math.max(2, Math.floor(displaySize * 0.05)) + 'px';
      style.paddingRight = Math.max(2, Math.floor(displaySize * 0.05)) + 'px';
      // Width is auto for letter sequences
    } else {
      style.width = `${displaySize}px`; // Single letter bead needs explicit width
    }
  } else {
    style.borderRadius = '50%'; 
    style.width = `${displaySize}px`;
  }

  // Calculate icon/letter size to fit within the element, leaving some padding
  const
   contentScaleFactor = 0.85; // How much of the element size the icon/letter should occupy
  const internalContentSize = Math.floor(displaySize * contentScaleFactor);


  return (
    <div
      style={style}
      onClick={onClick}
      onDragStart={onDragStart}
      draggable={draggable}
      title={element.name || element.type}
      role={onClick ? "button" : undefined}
      aria-pressed={onClick ? isSelected : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {isLetterSequence && element.type === ElementType.LETTER ? (
        (element.letter || '').split('').map((char, index) => (
          <LetterIcon
            key={index}
            char={char}
            color={element.color} 
            size={internalContentSize} // Use scaled internal size
          />
        ))
      ) : (
        <IconComponent
          color={element.color}
          size={internalContentSize} // Use scaled internal size
          char={element.type === ElementType.LETTER ? element.letter : undefined} // Pass letter char for single letter icon
        />
      )}
    </div>
  );
};

export default BraceletElementUI;