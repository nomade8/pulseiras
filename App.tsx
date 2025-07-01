import React, { useState, DragEvent } from 'react';
import { 
    BraceletElementItem, 
    CordType, 
    ElementType, 
    PaletteItem, 
    CORD_VISUAL_CLASSES, 
    DraggablePaletteItem
} from './types';
import PALETTE_ITEMS, { DEFAULT_INITIAL_LETTER } from './constants';
import ElementPalette from './components/ElementPalette';
import DesignArea from './components/DesignArea';
import CustomizationPanel from './components/CustomizationPanel';
import CordSelector from './components/CordSelector';
import BraceletPreview from './components/BraceletPreview.tsx';

const MAX_PIECES = 30;

const countPieces = (elements: BraceletElementItem[]): number => {
  return elements.reduce((count, el) => {
    if (el.type === ElementType.LETTER && el.letter) {
      return count + el.letter.length;
    }
    return count + 1;
  }, 0);
};

const App: React.FC = () => {
  const [braceletElements, setBraceletElements] = useState<BraceletElementItem[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [cordType, setCordType] = useState<CordType>(CordType.ELASTIC_TRANSPARENT);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  
  const [draggedPaletteItem, setDraggedPaletteItem] = useState<DraggablePaletteItem | null>(null);

  const addElementToBracelet = (item: PaletteItem | DraggablePaletteItem, quantity: number = 1) => {
    const currentPieceCount = countPieces(braceletElements);
    const piecesToAdd = quantity; 

    if (currentPieceCount + piecesToAdd > MAX_PIECES) {
        alert(`Não é possível adicionar. A pulseira comporta no máximo ${MAX_PIECES} peças. Peças atuais: ${currentPieceCount}.`);
        return;
    }
    
    let lastAddedId: string | null = null;
    const newElementsToAdd: BraceletElementItem[] = [];

    for (let i = 0; i < quantity; i++) {
      const newElementId = crypto.randomUUID();
      const newElement: BraceletElementItem = {
        id: newElementId,
        type: 'paletteItemType' in item ? item.paletteItemType : item.type,
        name: item.name,
        icon: item.icon,
        color: item.defaultColor,
        availableColors: item.availableColors,
        letter: item.isLetter ? (item.initialLetter || DEFAULT_INITIAL_LETTER) : undefined,
      };
      newElementsToAdd.push(newElement);
      lastAddedId = newElementId;
    }
    
    setBraceletElements(prev => [...prev, ...newElementsToAdd]);
    if (lastAddedId) {
        setSelectedElementId(lastAddedId); 
    }
  };

  const handlePaletteItemDragStart = (item: DraggablePaletteItem) => {
    setDraggedPaletteItem(item);
  };
  
  const handleDropOnDesignArea = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (draggedPaletteItem) {
      addElementToBracelet(draggedPaletteItem, 1); 
      setDraggedPaletteItem(null);
    }
  };

  const handleDragOverDesignArea = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); 
  };


  const removeElement = (id: string) => {
    setBraceletElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const updateElement = (id: string, updates: Partial<BraceletElementItem>) => {
    const elementToUpdate = braceletElements.find(el => el.id === id);
    if (!elementToUpdate) return;
    
    const finalUpdates = { ...updates };

    if (finalUpdates.letter !== undefined && elementToUpdate.type === ElementType.LETTER) {
        if (finalUpdates.letter === '') {
            finalUpdates.letter = DEFAULT_INITIAL_LETTER;
        }

        const oldLetter = elementToUpdate.letter || '';
        const newLetter = finalUpdates.letter;
        const pieceDiff = newLetter.length - oldLetter.length;
        const currentPieceCount = countPieces(braceletElements);

        if (pieceDiff > 0 && (currentPieceCount + pieceDiff > MAX_PIECES)) {
            alert(`Não é possível adicionar mais letras. A pulseira comporta no máximo ${MAX_PIECES} peças. Peças atuais: ${currentPieceCount}.`);
            return;
        }
    }
    
    setBraceletElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...finalUpdates } : el))
    );
  };

  const reorderElements = (draggedId: string, targetId: string) => {
    setBraceletElements(prevElements => {
      const draggedItemIndex = prevElements.findIndex(el => el.id === draggedId);
      const targetItemIndex = prevElements.findIndex(el => el.id === targetId);

      if (draggedItemIndex === -1 || targetItemIndex === -1) return prevElements;

      const newElements = [...prevElements];
      const [draggedItem] = newElements.splice(draggedItemIndex, 1);
      newElements.splice(targetItemIndex, 0, draggedItem);
      return newElements;
    });
  };
  

  const selectedElementDetails = braceletElements.find(el => el.id === selectedElementId) || null;

  const pieceCount = countPieces(braceletElements);
  const percentage = (pieceCount / MAX_PIECES) * 100;
  let braceletFullness: { percentage: number; text: string; style: string; };

  if (pieceCount === 0) {
    braceletFullness = { percentage, text: 'Vazia', style: 'text-gray-500' };
  } else if (percentage <= 60) {
    braceletFullness = { percentage, text: `Peças: ${pieceCount}/${MAX_PIECES}`, style: 'text-green-600' };
  } else if (percentage <= 85) {
    braceletFullness = { percentage, text: `Peças: ${pieceCount}/${MAX_PIECES}`, style: 'text-yellow-600' };
  } else if (percentage <= 100) {
    braceletFullness = { percentage, text: `Peças: ${pieceCount}/${MAX_PIECES}`, style: 'text-orange-500' };
  } else {
    braceletFullness = { percentage, text: `Peças: ${pieceCount}/${MAX_PIECES}`, style: 'text-red-600' };
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 text-gray-800">
      <header className="w-full max-w-5xl text-center my-4 sm:my-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          Criador de Pulseiras Interativo
        </h1>
      </header>

      {isPreviewMode ? (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <BraceletPreview elements={braceletElements} cordType={cordType} />
          <button
            onClick={() => setIsPreviewMode(false)}
            className="mt-6 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-150"
            aria-label="Voltar para edição"
          >
            Voltar para Edição
          </button>
        </div>
      ) : (
        <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="md:col-span-1 p-3 bg-white/70 backdrop-blur-md shadow-lg rounded-xl flex flex-col space-y-4" aria-labelledby="palette-heading">
             <div>
                <h2 id="palette-heading" className="text-xl font-semibold mb-3 text-purple-700">Elementos</h2>
                <ElementPalette
                  items={PALETTE_ITEMS}
                  onAddElement={addElementToBracelet}
                  onDragStartPaletteItem={handlePaletteItemDragStart}
                />
             </div>
             <div>
                <h2 className="text-xl font-semibold mb-3 text-purple-700">Fio / Cordão</h2>
                <CordSelector currentCord={cordType} onCordChange={setCordType} />
             </div>
          </section>

          <section 
            className="md:col-span-2 p-3 bg-white/70 backdrop-blur-md shadow-lg rounded-xl flex flex-col" 
            aria-labelledby="design-area-heading"
            onDrop={handleDropOnDesignArea}
            onDragOver={handleDragOverDesignArea}
          >
            <div className="flex justify-between items-center mb-1">
              <h2 id="design-area-heading" className="text-xl font-semibold text-purple-700">Sua Pulseira</h2>
              <span className={`text-sm font-medium px-2 py-1 rounded ${braceletFullness.style}`}>
                {braceletFullness.text}
              </span>
            </div>
            <div className="flex justify-end items-center mb-3 gap-2">
                <button
                    onClick={() => {
                        setBraceletElements([]);
                        setSelectedElementId(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-400 transition duration-150"
                    aria-label="Recomeçar (zerar a pulseira)"
                >
                    Recomeçar
                </button>
                <button
                    onClick={() => setIsPreviewMode(true)}
                    disabled={braceletElements.length === 0}
                    className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-sm hover:bg-pink-600 transition duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    aria-label="Visualizar pulseira em 3D"
                >
                    Visualizar
                </button>
            </div>

            <DesignArea
              elements={braceletElements}
              cordType={cordType}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onReorderElements={reorderElements}
            />
            {selectedElementDetails && (
              <CustomizationPanel
                key={selectedElementId} 
                element={selectedElementDetails}
                onUpdateElement={updateElement}
                onRemoveElement={removeElement}
                letters={[]} 
              />
            )}
            {braceletElements.length === 0 && !draggedPaletteItem && (
                 <div className="flex-grow flex items-center justify-center text-gray-500">
                    <p>Arraste elementos da paleta para cá ou clique para adicionar.</p>
                 </div>
            )}
             {draggedPaletteItem && (
                <div className="flex-grow flex items-center justify-center text-indigo-500 border-2 border-dashed border-indigo-300 rounded-md p-4 my-2">
                    <p>Solte aqui para adicionar o elemento: {draggedPaletteItem.name}</p>
                </div>
            )}
          </section>
        </main>
      )}
       <footer className="w-full text-center py-4 mt-auto">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Criador de Pulseiras. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;