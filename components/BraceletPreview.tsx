

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BraceletElementItem, CordType, ElementType } from '../types';
import { COMMON_COLORS } from '../constants';

const BASE_3D_SIZE = 0.30; 
const BRACELET_RADIUS = 1.43; // Adjusted for a capacity of ~30 standard pieces
const CORD_THICKNESS = 0.04; 
const LETTER_BEAD_SIZE = BASE_3D_SIZE * 0.9; 
const LETTER_SPACING = BASE_3D_SIZE * 0.1; 
const LETTER_TEXTURE_RESOLUTION = 128;

// Define a new constant for bead size for clarity
const SPHERICAL_BEAD_SIZE = BASE_3D_SIZE * 0.85; // Increased from 0.5 to 0.85

function getCordMaterial(cordType: CordType): THREE.Material {
    switch (cordType) {
        case CordType.ELASTIC_TRANSPARENT:
            return new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.7, roughness: 0.3 });
        case CordType.WAXED_BLACK:
            return new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
        case CordType.WAXED_PINK:
            return new THREE.MeshStandardMaterial({ color: COMMON_COLORS.PINK, roughness: 0.8 });
        case CordType.WAXED_BLUE:
            return new THREE.MeshStandardMaterial({ color: COMMON_COLORS.LIGHT_BLUE, roughness: 0.8 });
        default:
            return new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 });
    }
}

function createLetterTexture(
    text: string, 
    textColorHex: string, 
    backgroundColorHex: string = '#FFFFFF', 
    textureSize: number = LETTER_TEXTURE_RESOLUTION,
    isSymbol: boolean = false
): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    const context = canvas.getContext('2d');
    if (!context) {
        const texture = new THREE.Texture(); 
        console.warn('Could not get 2D context for letter/symbol texture');
        return texture as THREE.CanvasTexture;
    }

    context.fillStyle = backgroundColorHex;
    context.fillRect(0, 0, textureSize, textureSize);

    // Adjust font size based on whether it's a multi-char text or a single symbol
    const fontSize = Math.floor(textureSize * (isSymbol ? 0.75 : 0.7)); 
    context.font = `bold ${fontSize}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Consistent Y position for text and symbol
    const yPos = textureSize / 2 + (isSymbol ? textureSize * 0.03 : 0); // Slight y-offset for symbols if needed, smaller than before

    if (isSymbol) {
        // Add a thin dark outline for better visibility of light-colored symbols on white background
        context.strokeStyle = '#444444'; // Dark gray outline
        context.lineWidth = Math.max(1, Math.floor(fontSize * 0.05)); // Thin outline, proportional to font size
        context.strokeText(text.toUpperCase(), textureSize / 2, yPos);
    }

    context.fillStyle = textColorHex;
    context.fillText(text.toUpperCase(), textureSize / 2, yPos);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}


interface BraceletPreviewProps {
    elements: BraceletElementItem[];
    cordType: CordType;
}

const BraceletPreview: React.FC<BraceletPreviewProps> = ({ elements, cordType }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const braceletElementsGroupRef = useRef<THREE.Group | null>(null); 
    const cordMeshRef = useRef<THREE.Mesh | null>(null);


    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current; // Capture mountRef.current

        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0xe0e0e0); // Changed background color to a clearer gray

        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, BRACELET_RADIUS * 1.1, BRACELET_RADIUS * 2.3);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true; 
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        directionalLight.shadow.mapSize.width = 1024; 
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;    
        directionalLight.shadow.camera.far = 50;     
        scene.add(directionalLight);


        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0); 
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = BRACELET_RADIUS * 1.2;
        controls.maxDistance = BRACELET_RADIUS * 6;
        controls.maxPolarAngle = Math.PI / 1.5; 
        controlsRef.current = controls;
        
        const cordGeometry = new THREE.TorusGeometry(BRACELET_RADIUS, CORD_THICKNESS, 20, 120);
        const cordMaterial = getCordMaterial(cordType);
        const cordMesh = new THREE.Mesh(cordGeometry, cordMaterial);
        cordMesh.rotation.x = Math.PI / 2; 
        cordMesh.receiveShadow = true; 
        scene.add(cordMesh);
        cordMeshRef.current = cordMesh;

        const elementsGroup = new THREE.Group();
        scene.add(elementsGroup);
        braceletElementsGroupRef.current = elementsGroup;
        
        const handleResize = () => {
            if (currentMount && cameraRef.current && rendererRef.current) {
                const width = currentMount.clientWidth;
                const height = currentMount.clientHeight;
                if (width > 0 && height > 0) { // Ensure dimensions are valid
                    cameraRef.current.aspect = width / height;
                    cameraRef.current.updateProjectionMatrix();
                    rendererRef.current.setSize(width, height);
                }
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        // Defer the initial resize to the next animation frame
        requestAnimationFrame(() => {
            handleResize();
        });

        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();


        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (rendererRef.current && currentMount && rendererRef.current.domElement) {
                 currentMount.removeChild(rendererRef.current.domElement);
            }
            controlsRef.current?.dispose();
            
            sceneRef.current?.traverse(object => {
                if (object instanceof THREE.Mesh) {
                    object.geometry?.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => {
                             if (material.map) material.map.dispose();
                             material.dispose();
                        });
                    } else {
                        if (object.material?.map) object.material.map.dispose();
                        object.material?.dispose();
                    }
                }
            });
            rendererRef.current?.dispose();
            sceneRef.current = null;
            rendererRef.current = null;
            cameraRef.current = null;
            controlsRef.current = null;
            braceletElementsGroupRef.current = null;
            cordMeshRef.current = null;
        };
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        if (cordMeshRef.current) {
            const currentMaterial = cordMeshRef.current.material;
            if (Array.isArray(currentMaterial)) {
                currentMaterial.forEach(mat => mat.dispose());
            } else {
                currentMaterial.dispose();
            }
            cordMeshRef.current.material = getCordMaterial(cordType);
        }
    }, [cordType]);


    useEffect(() => {
        if (!braceletElementsGroupRef.current || !sceneRef.current) return;

        // Clear previous elements
        while (braceletElementsGroupRef.current.children.length > 0) {
            const child = braceletElementsGroupRef.current.children[0];
            braceletElementsGroupRef.current.remove(child);
            if (child instanceof THREE.Mesh || child instanceof THREE.Group) { 
                 child.traverse(obj => {
                    if (obj instanceof THREE.Mesh) {
                        obj.geometry?.dispose();
                         if (Array.isArray(obj.material)) {
                            obj.material.forEach(m => {
                                if (m.map) m.map.dispose();
                                m.dispose();
                            });
                        } else {
                            if (obj.material?.map) obj.material.map.dispose();
                            obj.material?.dispose();
                        }
                    }
                 });
            }
        }
        
        if (elements.length === 0) return;

        // Flatten the elements array into individual renderable pieces.
        const renderablePieces: BraceletElementItem[] = [];
        elements.forEach(element => {
            if (element.type === ElementType.LETTER && element.letter && element.letter.length > 1) {
                element.letter.split('').forEach(char => {
                    // Create a new "element" for each character
                    renderablePieces.push({
                        ...element, // Copy properties like color, id, etc.
                        letter: char, // The single character for this piece
                    });
                });
            } else {
                renderablePieces.push(element);
            }
        });
        
        // Reverse the entire array of pieces. The 3D rendering places items
        // counter-clockwise, which appears as right-to-left. Reversing the
        // array before rendering ensures the visual order matches the 2D design area.
        const piecesToRender = [...renderablePieces].reverse();

        const approximateTotalElementsWidth = piecesToRender.reduce((sum, piece) => {
            const width = piece.type === ElementType.BEAD ? SPHERICAL_BEAD_SIZE : LETTER_BEAD_SIZE;
            return sum + width + LETTER_SPACING;
        }, 0);

        const braceletCircumference = 2 * Math.PI * BRACELET_RADIUS;
        const angleCompressionFactor = Math.min(1, braceletCircumference / (approximateTotalElementsWidth * 1.05)); 

        let currentAngle = 0; 

        piecesToRender.forEach((piece) => {
            let elementMesh: THREE.Object3D;
            let currentElementActualWidth: number;
            const charmSideMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.7 });

            if (piece.type === ElementType.LETTER && piece.letter) {
                currentElementActualWidth = LETTER_BEAD_SIZE;
                const letterGeometry = new THREE.BoxGeometry(LETTER_BEAD_SIZE, LETTER_BEAD_SIZE, LETTER_BEAD_SIZE);
                const letterTexture = createLetterTexture(piece.letter, piece.color, '#FFFFFF', LETTER_TEXTURE_RESOLUTION);
                const letterMaterials = [ 
                    charmSideMaterial, charmSideMaterial, charmSideMaterial, charmSideMaterial, 
                    new THREE.MeshStandardMaterial({ map: letterTexture, roughness: 0.6, metalness: 0.1 }), 
                    charmSideMaterial, 
                ];
                const letterCube = new THREE.Mesh(letterGeometry, letterMaterials);
                letterCube.castShadow = true;
                letterCube.receiveShadow = true;
                elementMesh = letterCube;

            } else if (
                piece.type === ElementType.HEART ||
                piece.type === ElementType.STAR ||
                piece.type === ElementType.SUN ||
                piece.type === ElementType.MOON ||
                piece.type === ElementType.EVIL_EYE
            ) {
                currentElementActualWidth = LETTER_BEAD_SIZE;
                const charmGeometry = new THREE.BoxGeometry(LETTER_BEAD_SIZE, LETTER_BEAD_SIZE, LETTER_BEAD_SIZE);
                let symbol = '?';
                switch (piece.type) {
                    case ElementType.HEART: symbol = '♥'; break;
                    case ElementType.STAR: symbol = '★'; break;
                    case ElementType.SUN: symbol = '☼'; break;
                    case ElementType.MOON: symbol = '☾'; break; 
                    case ElementType.EVIL_EYE: symbol = '👁'; break;
                }
                const charmTexture = createLetterTexture(symbol, piece.color, '#FFFFFF', LETTER_TEXTURE_RESOLUTION, true);
                const charmMaterials = [
                    charmSideMaterial, charmSideMaterial, charmSideMaterial, charmSideMaterial,
                    new THREE.MeshStandardMaterial({ map: charmTexture, roughness: 0.6, metalness: 0.1 }),
                    charmSideMaterial,
                ];
                const charmCube = new THREE.Mesh(charmGeometry, charmMaterials);
                charmCube.castShadow = true;
                charmCube.receiveShadow = true;
                elementMesh = charmCube;

            } else { // BEAD
                currentElementActualWidth = SPHERICAL_BEAD_SIZE; 
                const geometry = new THREE.SphereGeometry(SPHERICAL_BEAD_SIZE / 2, 32, 16);
                const material = new THREE.MeshStandardMaterial({ color: piece.color, roughness: 0.4, metalness: 0.2 });
                elementMesh = new THREE.Mesh(geometry, material);
                elementMesh.castShadow = true;
                elementMesh.receiveShadow = true;
            }
            
            const angleForHalfCurrentElement = (currentElementActualWidth / braceletCircumference) * 2 * Math.PI * 0.5 * angleCompressionFactor;
            currentAngle += angleForHalfCurrentElement;

            const x = BRACELET_RADIUS * Math.cos(currentAngle);
            const z = BRACELET_RADIUS * Math.sin(currentAngle);
            elementMesh.position.set(x, 0, z);
            
            elementMesh.lookAt(0,0,0); 
            if (piece.type !== ElementType.BEAD) {
                 elementMesh.rotation.y += Math.PI; 
            } else { 
                elementMesh.rotation.y += (Math.random() - 0.5) * Math.PI * 2;
                elementMesh.rotation.x += (Math.random() - 0.5) * Math.PI * 2;
            }

            braceletElementsGroupRef.current.add(elementMesh);
            
            currentAngle += angleForHalfCurrentElement; 
            const angleForInterElementSpacing = (LETTER_SPACING / braceletCircumference) * 2 * Math.PI * angleCompressionFactor;
            currentAngle += angleForInterElementSpacing;
        });

    }, [elements, cordType]); 

    return (
        <div className="w-full flex flex-col items-center p-4">
            <h3 className="text-2xl font-semibold mb-6 text-purple-700">Pré-visualização da Pulseira</h3>
            <div 
                ref={mountRef} 
                style={{ width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                role="img"
                aria-label="Visualização 3D interativa da pulseira"
            >
                {/* Three.js canvas will be appended here */}
            </div>
             {elements.length === 0 && (
                <p className="text-gray-500 mt-4">Sua pulseira está vazia. Adicione elementos para vê-los aqui em 3D!</p>
            )}
        </div>
    );
};

export default BraceletPreview;