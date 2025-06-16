import React, { useEffect, useRef, useState } from 'react';

// ============================================================================
// The WavePattern component is now defined directly inside the same file.
// ============================================================================

/**
 * A self-contained, reusable React component that renders an interactive
 * triple-slit wave interference pattern using Tailwind CSS for styling.
 * It is responsive and will adapt its orientation based on the container's aspect ratio.
 * @param {object} props - Standard React props. `className` will be passed to the container.
 */
const WavePattern = ({ className, ...props }) => {
    const animationContainerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // This effect observes the container element and updates the dimensions state
    // whenever the container's size changes. This is more efficient than a global resize listener.
    useEffect(() => {
        const container = animationContainerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // This effect runs the animation logic. It depends on the `dimensions` state,
    // so it will automatically re-run and adapt the animation if the container size changes.
    useEffect(() => {
        const animationContainer = animationContainerRef.current;
        if (!animationContainer || dimensions.width === 0 || dimensions.height === 0) {
            return;
        }

        let animationFrameId = null;

        const setupAndRunAnimation = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            animationContainer.innerHTML = '';
            
            const isMobileLayout = window.innerWidth <= 768;

            // --- User's parameters preserved ---
            const config = {
                cols: Math.floor(dimensions.width / 7.2),
                rows: Math.floor(dimensions.height / 12),
                wavelength: 10,
                waveSpeed: 1,
                k: (1.5 * Math.PI) / 10, 
                slitPosition: 0,
                slits: []
            };
            
            if (isMobileLayout) {
                // Mobile (Top to Bottom flow)
                config.slitPosition = Math.floor(config.rows / 3); 
                const slitSeparation = 0.3 * config.cols;
                const centerCol = Math.floor(config.cols / 2);
                config.slits = [
                    { y: config.slitPosition, x: centerCol - slitSeparation },
                    { y: config.slitPosition, x: centerCol },
                    { y: config.slitPosition, x: centerCol + slitSeparation }
                ];
            } else {
                // Desktop (Left to Right flow)
                config.slitPosition = Math.floor(config.cols / 4); 
                const slitSeparation = 0.3 * config.rows;
                config.slits = [
                    { x: config.slitPosition, y: Math.floor(config.rows / 2 - slitSeparation) },
                    { x: config.slitPosition, y: Math.floor(config.rows / 2) },
                    { x: config.slitPosition, y: Math.floor(config.rows / 2 + slitSeparation) }
                ];
            }

            const asciiChars = [" ", ".", "=", "+", "*", "#", "%", "@", "Y", "R", "A", "N", "E", "M", "U", "L"];
            let time = 0;

            const createWall = () => {
                const wall = Array(config.rows).fill().map(() => Array(config.cols).fill(null));
                for (let r = 0; r < config.rows; r++) {
                    for (let c = 0; c < config.cols; c++) {
                        let isWallPoint = isMobileLayout ? (r === config.slitPosition) : (c === config.slitPosition);
                        if (isWallPoint) {
                            const isSlit = config.slits.some(slit => isMobileLayout ? (Math.abs(c - slit.x) < 4) : (Math.abs(r - slit.y) < 2));
                            wall[r][c] = { char: isSlit ? ' ' : (isMobileLayout ? '━' : '┃'), style: { color: '#fdf6e3' } };
                        } else {
                             let isSourceSide = isMobileLayout ? (r < config.slitPosition) : (c < config.slitPosition);
                             if(isSourceSide) wall[r][c] = { char: ' ', style: {} };
                        }
                    }
                }
                return wall;
            };

            const precomputeDistances = () => {
                return config.slits.map(slit =>
                    Array(config.rows).fill().map((_, r) =>
                        Array(config.cols).fill().map((_, c) => {
                            const dx = c - slit.x;
                            const dy = r - slit.y;
                            return Math.sqrt(dx * dx + dy * dy);
                        })
                    )
                );
            };

            const wall = createWall();
            const distances = precomputeDistances();

            const animate = () => {
                const fragment = document.createDocumentFragment();
                for (let r = 0; r < config.rows; r++) {
                    for (let c = 0; c < config.cols; c++) {
                        const span = document.createElement('span');
                        let cell;
                        if (wall[r][c] !== null) {
                            cell = wall[r][c];
                        } else {
                            let totalAmplitude = 0;
                            distances.forEach((distGrid) => {
                                const distance = distGrid[r][c];
                                const phase = config.k * distance - config.waveSpeed * time;
                                totalAmplitude += Math.sin(phase) / Math.max(1, distance * 1.5);
                            });
                            const intensity = totalAmplitude * totalAmplitude;
                            const clampedIntensity = Math.min(1, Math.max(0, 50 * intensity));
                            const charIndex = Math.floor(clampedIntensity * (asciiChars.length - 1));
                            
                            // --- FIX: Restored high-contrast color scheme to improve visual symmetry ---
                            const hue = totalAmplitude > 0 ? 180 : 30; 
                            const lightness = 20 + Math.pow(clampedIntensity, 0.8) * 50; 
                            const color = `hsl(${hue}, 90%, ${lightness}%)`;
                            cell = { char: asciiChars[charIndex], style: { color: color } };
                        }
                        span.textContent = cell.char;
                        span.style.color = cell.style.color;
                        fragment.appendChild(span);
                    }
                    fragment.appendChild(document.createElement('br'));
                }
                if (animationContainer) {
                    animationContainer.innerHTML = '';
                    animationContainer.appendChild(fragment);
                }
                time += 0.1;
                animationFrameId = requestAnimationFrame(animate);
            };

            animate();
        };

        setupAndRunAnimation();

        // The cleanup function for when the component unmounts
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [dimensions]); // The dependency array ensures this effect re-runs when dimensions change.

    return (
        <pre 
            ref={animationContainerRef} 
            className={`w-full h-full m-0 p-0 bg-black text-[#fdf6e3] font-mono text-xs leading-none whitespace-pre overflow-hidden ${className || ''}`}
            {...props}
        />
    );
};


// ============================================================================
// The main App component demonstrates the new layout.
// ============================================================================

function App() {
  return (
    // Main container: flex-col for mobile, lg:flex-row for desktop.
    <div className="flex flex-col lg:flex-row w-screen h-screen bg-black text-white overflow-hidden">
      
      {/* Content Panel (Left on Desktop, Top on Mobile) */}
      <div className="w-full lg:w-[60%] h-[70vh] lg:h-full p-8 flex flex-col justify-start pt-12 lg:pt-8 lg:justify-center items-center order-1 overflow-y-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold">My Application</h1>
            
          </header>
      </div>

      {/* --- CHANGE: Wave Pattern Panel is now wider on desktop --- */}
      <div className="w-full h-[30vh] lg:w-[40%] lg:h-full order-2">
         <WavePattern />
      </div>

    </div>
  );
}

export default App;
