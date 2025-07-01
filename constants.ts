import { ElementType, PaletteItem } from './types';
import BeadIcon from './components/icons/BeadIcon';
import HeartIcon from './components/icons/HeartIcon';
import StarIcon from './components/icons/StarIcon';
import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';
import EvilEyeIcon from './components/icons/EvilEyeIcon';
import LetterIcon from './components/icons/LetterIcon';

export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
export const DEFAULT_INITIAL_LETTER = 'A';

export const COMMON_COLORS = {
  PINK: '#FFC0CB',
  LIGHT_BLUE: '#ADD8E6',
  GOLD: '#FFD700',
  SILVER: '#C0C0C0',
  RED: '#FF0000',
  GREEN: '#008000',
  PURPLE: '#800080',
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  ORANGE: '#FFA500',
  YELLOW: '#FFFF00',
  TURQUOISE: '#40E0D0',
};

const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: ElementType.BEAD,
    name: 'Miçanga Redonda',
    icon: BeadIcon,
    defaultColor: COMMON_COLORS.PINK,
    availableColors: [COMMON_COLORS.PINK, COMMON_COLORS.LIGHT_BLUE, COMMON_COLORS.GREEN, COMMON_COLORS.PURPLE, COMMON_COLORS.ORANGE, COMMON_COLORS.YELLOW, COMMON_COLORS.RED, COMMON_COLORS.WHITE, COMMON_COLORS.BLACK],
  },
  {
    type: ElementType.HEART,
    name: 'Coração',
    icon: HeartIcon,
    defaultColor: COMMON_COLORS.RED,
    availableColors: [COMMON_COLORS.RED, COMMON_COLORS.PINK, COMMON_COLORS.GOLD, COMMON_COLORS.SILVER, COMMON_COLORS.PURPLE],
  },
  {
    type: ElementType.STAR,
    name: 'Estrela',
    icon: StarIcon,
    defaultColor: COMMON_COLORS.GOLD,
    availableColors: [COMMON_COLORS.GOLD, COMMON_COLORS.SILVER, COMMON_COLORS.LIGHT_BLUE],
  },
  {
    type: ElementType.SUN,
    name: 'Sol',
    icon: SunIcon,
    defaultColor: COMMON_COLORS.YELLOW,
    availableColors: [COMMON_COLORS.YELLOW, COMMON_COLORS.ORANGE, COMMON_COLORS.GOLD],
  },
  {
    type: ElementType.MOON,
    name: 'Lua',
    icon: MoonIcon,
    defaultColor: COMMON_COLORS.SILVER,
    availableColors: [COMMON_COLORS.SILVER, '#E0E0E0', COMMON_COLORS.LIGHT_BLUE],
  },
  {
    type: ElementType.EVIL_EYE,
    name: 'Olho Grego',
    icon: EvilEyeIcon,
    defaultColor: '#4285F4', // Traditional blue
    availableColors: ['#4285F4', '#00BFFF', '#2255AA'], // Different shades of blue
  },
  {
    type: ElementType.LETTER,
    name: 'Letra',
    icon: LetterIcon,
    defaultColor: COMMON_COLORS.BLACK, // Default text color
    availableColors: [COMMON_COLORS.BLACK, COMMON_COLORS.GOLD, COMMON_COLORS.SILVER, COMMON_COLORS.PINK], // Color of the letter char itself
    isLetter: true,
    initialLetter: DEFAULT_INITIAL_LETTER,
  },
];

export default PALETTE_ITEMS;