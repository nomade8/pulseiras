import React, { useState } from 'react';
import { BraceletElementItem, CordType, CORD_VISUAL_CLASSES, ELEMENT_BASE_SIZE_PX } from '../types';
import BraceletElementUI from './BraceletElementUI';

interface DesignAreaProps {
  elements: BraceletElementItem[];
  cordType: CordType;
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onReorderElements: (draggedId: string, targetId: string) => void;
}

const DesignArea: React.FC<DesignAreaProps> = ({
  elements,
  cordType,
  selectedElementId,
  onSelectElement,
  onReorderElements,
}) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id); // Required for Firefox
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault(); // Allow drop
    if (draggedItemId && draggedItemId !== targetId) {
        // Optional: Add visual feedback class to e.currentTarget
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== targetId) {
      onReorderElements(draggedItemId, targetId);
    }
    setDraggedItemId(null);
  };

  const cordClasses = CORD_VISUAL_CLASSES[cordType] || CORD_VISUAL_CLASSES[CordType.ELASTIC_TRANSPARENT];

  return (
    <div 
      className={`flex-grow p-4 min-h-[${ELEMENT_BASE_SIZE_PX + 40}px] flex items-start justify-start border-2 border-dashed ${cordClasses} rounded-lg overflow-y-auto`}
      aria-label="Área de design da pulseira"
      style={{ maxHeight: '250px' }} // Set a max height for the wrapping container
    >
      {elements.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-400">Arraste elementos da paleta ou clique para começar.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 items-center w-full"> {/* Use flex-wrap and gap */}
          {elements.map((el) => (
            <div
              key={el.id}
              onDragOver={(e) => handleDragOver(e, el.id)}
              onDrop={(e) => handleDrop(e, el.id)}
              className={`transition-all duration-150 ease-in-out ${draggedItemId === el.id ? 'opacity-50' : ''}`}
            >
              <BraceletElementUI
                element={el}
                size={ELEMENT_BASE_SIZE_PX}
                isSelected={selectedElementId === el.id}
                onClick={() => onSelectElement(el.id)}
                onDragStart={(e) => handleDragStart(e, el.id)}
                draggable={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignArea;