import React from 'react';
import { PaletteItem, DraggablePaletteItem, ELEMENT_BASE_SIZE_PX, ElementType } from '../types';
import BraceletElementUI from './BraceletElementUI';

interface ElementPaletteProps {
  items: PaletteItem[];
  onAddElement: (item: PaletteItem, quantity: number) => void; 
  onDragStartPaletteItem: (item: DraggablePaletteItem) => void;
}

const ElementPalette: React.FC<ElementPaletteProps> = ({ items, onAddElement, onDragStartPaletteItem }) => {
  
  // Agora adiciona sempre 1 unidade ao clicar
  const handleItemClick = (item: PaletteItem) => {
    onAddElement(item, 1);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: PaletteItem) => {
     const draggableItem: DraggablePaletteItem = {
        paletteItemType: item.type,
        name: item.name,
        icon: item.icon,
        defaultColor: item.defaultColor,
        // defaultSizeFactor and other size props removed
        availableColors: item.availableColors,
        isLetter: item.isLetter,
        initialLetter: item.initialLetter,
     };
    onDragStartPaletteItem(draggableItem);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('text/plain', item.name); 
    }
  };


  return (
    <div className="p-2 bg-gray-50 rounded-lg shadow max-h-96 overflow-y-auto">
      <ul className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3"> {/* Adjusted gap and columns for larger items */}
        {items.map((item, index) => (
          <li key={index} className="flex flex-col items-center"
            title={`Adicionar ${item.name}`}
          >
            <div
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(item);}}
              tabIndex={0}
              role="button"
              aria-label={`Adicionar ${item.name}`}
              className="cursor-pointer p-1 rounded-md hover:bg-pink-100 transition-colors flex justify-center items-center" // Ensure centering
              draggable="true"
              onDragStart={(e) => handleDragStart(e, item)}
              style={{ width: `${ELEMENT_BASE_SIZE_PX * 0.85}px`, height: `${ELEMENT_BASE_SIZE_PX * 0.85}px`}} // Give explicit size to container
            >
              <BraceletElementUI
                element={{ // This is a temporary structure for UI, not a full BraceletElementItem
                  icon: item.icon,
                  color: item.defaultColor,
                  letter: item.isLetter ? item.initialLetter : undefined,
                  type: item.type as ElementType, // Cast to ElementType
                  name: item.name,
                  id: `palette-${index}`, // Dummy id
                  // No sizeFactor needed here
                }}
                size={ELEMENT_BASE_SIZE_PX * 0.75} // Scale down slightly for palette
              />
            </div>
            <span className="text-xs text-center mt-1 text-gray-600">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElementPalette;