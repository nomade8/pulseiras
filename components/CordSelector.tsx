import React from 'react';
import { CordType, CORD_VISUAL_CLASSES, CORD_FRIENDLY_NAMES } from '../types';

interface CordSelectorProps {
  currentCord: CordType;
  onCordChange: (cordType: CordType) => void;
}

const CordSelector: React.FC<CordSelectorProps> = ({ currentCord, onCordChange }) => {
  return (
    <div className="p-2 bg-gray-50 rounded-lg shadow">
      <div className="space-y-2">
        {(Object.values(CordType) as CordType[]).map(type => (
          <button
            key={type}
            onClick={() => onCordChange(type)}
            className={`w-full text-left p-2 rounded-md transition-colors text-sm font-medium flex items-center
                        ${currentCord === type 
                            ? 'bg-purple-500 text-white shadow-md' 
                            : 'bg-white hover:bg-purple-100 text-gray-700'}`}
            aria-pressed={currentCord === type}
          >
            <span className={`inline-block w-4 h-4 rounded-full mr-2 border ${CORD_VISUAL_CLASSES[type].split(' ')[0]}`} style={{backgroundColor: CORD_VISUAL_CLASSES[type].split('bg-')[1]?.split('/')[0] || 'transparent'}}></span>
            {CORD_FRIENDLY_NAMES[type]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CordSelector;
