import React from 'react';

export enum ElementType {
  BEAD = 'BEAD',
  HEART = 'HEART',
  STAR = 'STAR',
  LETTER = 'LETTER',
  SUN = 'SUN',
  MOON = 'MOON',
  EVIL_EYE = 'EVIL_EYE',
}

export interface IconProps {
  className?: string;
  color?: string;
  size: number; // Made required, will be passed consistently
  char?: string; 
}

export interface BaseElement {
  id: string; 
  type: ElementType;
  name: string;
  icon: React.FC<IconProps>;
  color: string; 
  availableColors?: string[]; 
  // Properties related to size customization are removed
}

export interface LetterElementProperties {
  letter: string; // Can now be a single char or a full word/name
}

export type BraceletElementItem = BaseElement & Partial<LetterElementProperties>;


export interface PaletteItem {
  type: ElementType;
  name: string;
  icon: React.FC<IconProps>;
  defaultColor: string;
  // Properties related to size customization are removed
  availableColors?: string[];
  isLetter?: boolean; 
  initialLetter?: string; // For the first letter when a letter element is added
}

export interface DraggablePaletteItem {
  paletteItemType: ElementType; 
  defaultColor: string;
  // Properties related to size customization are removed
  availableColors?: string[];
  isLetter?: boolean;
  icon: React.FC<IconProps>; 
  name: string;
  initialLetter?: string;
}


export enum CordType {
  ELASTIC_TRANSPARENT = 'ELÁSTICO TRANSPARENTE',
  WAXED_BLACK = 'FIO ENCERADO PRETO',
  WAXED_PINK = 'FIO ENCERADO ROSA',
  WAXED_BLUE = 'FIO ENCERADO AZUL',
}

export const CORD_VISUAL_CLASSES: Record<CordType, string> = {
  [CordType.ELASTIC_TRANSPARENT]: 'border-gray-300 bg-gray-100/50',
  [CordType.WAXED_BLACK]: 'border-black bg-gray-700/50',
  [CordType.WAXED_PINK]: 'border-pink-500 bg-pink-300/50',
  [CordType.WAXED_BLUE]: 'border-blue-500 bg-blue-300/50',
};

export const CORD_FRIENDLY_NAMES: Record<CordType, string> = {
  [CordType.ELASTIC_TRANSPARENT]: 'Elástico Transparente',
  [CordType.WAXED_BLACK]: 'Fio Encerado Preto',
  [CordType.WAXED_PINK]: 'Fio Encerado Rosa',
  [CordType.WAXED_BLUE]: 'Fio Encerado Azul',
};

export const ELEMENT_BASE_SIZE_PX = 60; // Increased base size for 2D elements
export const MAX_NAME_LENGTH = 10; // Maximum length for names/words

// Constants for bracelet fullness estimation
export const MAX_BRACELET_CONTENT_WIDTH_PX = 700; // Estimated max width for a "full" bracelet in 2D
export const INTER_ELEMENT_SPACING_PX = 5; // Assumed spacing in 2D for calculation
export const LETTER_CHAR_ESTIMATED_WIDTH_PX = ELEMENT_BASE_SIZE_PX * 0.65; // Estimated width of a single letter character in a word for fullness calculation