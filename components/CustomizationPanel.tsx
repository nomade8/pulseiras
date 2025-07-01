import React, { useState, useEffect } from 'react';
import { BraceletElementItem, ElementType, MAX_NAME_LENGTH } from '../types';
import { DEFAULT_INITIAL_LETTER } from '../constants';

interface CustomizationPanelProps {
  element: BraceletElementItem;
  onUpdateElement: (id: string, updates: Partial<BraceletElementItem>) => void;
  onRemoveElement: (id: string) => void;
  letters: string[]; 
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  element,
  onUpdateElement,
  onRemoveElement,
}) => {
  const [currentColor, setCurrentColor] = useState(element.color);

  useEffect(() => {
    setCurrentColor(element.color);
  }, [element]);

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    onUpdateElement(element.id, { color });
  };

  const handleLetterOrWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newText = e.target.value.toUpperCase();
    newText = newText.replace(/[^A-Z]/g, '');
    if (newText.length > MAX_NAME_LENGTH) {
      newText = newText.substring(0, MAX_NAME_LENGTH);
    }
    onUpdateElement(element.id, { letter: newText });
  };

  const handleLetterInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (element.type === ElementType.LETTER && e.target.value === DEFAULT_INITIAL_LETTER && e.target.value.length === 1) {
      e.target.select();
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow max-w-md mx-auto" aria-labelledby={`customization-heading-${element.id}`}>
      <h3 id={`customization-heading-${element.id}`} className="text-lg font-semibold mb-3 text-purple-600">Personalizar: {element.name}</h3>
      
      {element.availableColors && element.availableColors.length > 0 && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cor {element.type === ElementType.LETTER ? '(da letra)' : ''}:
          </label>
          <div className="flex flex-wrap gap-2">
            {element.availableColors.map(colorOption => (
              <button
                key={colorOption}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${currentColor === colorOption ? 'border-purple-500 ring-2 ring-purple-300' : 'border-gray-300'}`}
                style={{ backgroundColor: colorOption }}
                onClick={() => handleColorChange(colorOption)}
                aria-label={`Selecionar cor ${colorOption}`}
                title={colorOption}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size customization section removed */}
      
      {element.type === ElementType.LETTER && (
         <div className="mb-3">
          <label htmlFor={`letter-input-${element.id}`} className="block text-sm font-medium text-gray-700">Palavra/Nome (até {MAX_NAME_LENGTH} letras A-Z):</label>
          <input
            type="text"
            id={`letter-input-${element.id}`}
            value={element.letter || ''}
            onChange={handleLetterOrWordChange}
            onFocus={handleLetterInputFocus}
            maxLength={MAX_NAME_LENGTH}
            className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-gray-900 shadow-sm placeholder-gray-400"
            placeholder="Digite aqui"
          />
        </div>
      )}

      <button
        onClick={() => onRemoveElement(element.id)}
        className="w-full mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 transition duration-150"
        aria-label={`Remover ${element.name} da pulseira`}
      >
        Remover Elemento
      </button>
    </div>
  );
};

export default CustomizationPanel;