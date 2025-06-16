import React, { useEffect, useRef, useState } from 'react';

// ============================================================================
// The WavePattern component has been replaced with the CodeRainAnimation component.
// ============================================================================

/**
 * A self-contained, reusable React component that renders a "digital rain"
 * style animation with random characters in a constant state of flux.
 * @param {object} props - Standard React props. `className` will be passed to the container.
 */
const CodeRainAnimation = ({ className, ...props }) => {
    const animationContainerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // This effect observes the container element and updates the dimensions state
    // whenever its size changes.
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
    // so it will automatically re-run if the container size changes.
    useEffect(() => {
        const animationContainer = animationContainerRef.current;
        if (!animationContainer || dimensions.width === 0 || dimensions.height === 0) {
            return;
        }

        let animationFrameId = null;

        // --- FIX: Adjusted character width divisor to better fill the container ---
        const cols = Math.floor(dimensions.width / 7.8);
        const rows = Math.floor(dimensions.height / 14);
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*+-<>/?!;{}[]";
        
        // Initialize a 2D grid to hold the state of each character cell
        let grid = Array(rows).fill(null).map(() => 
            Array(cols).fill(null).map(() => ({
                char: characters[Math.floor(Math.random() * characters.length)],
                opacity: Math.random()
            }))
        );

        const animate = () => {
            const fragment = document.createDocumentFragment();

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const span = document.createElement('span');
                    const cell = grid[r] && grid[r][c] ? grid[r][c] : { char: ' ', opacity: 0 };
                    
                    // Add a chance for each character to change in each frame
                    if (Math.random() > 0.98) {
                       cell.char = characters[Math.floor(Math.random() * characters.length)];
                       cell.opacity = 1; // Make new characters bright
                    }
                    
                    // Fade out the characters over time
                    cell.opacity = Math.max(0, cell.opacity - 0.01);
                    
                    span.textContent = cell.char;
                    span.style.opacity = cell.opacity;
                    fragment.appendChild(span);
                }
                fragment.appendChild(document.createElement('br'));
            }

            if (animationContainer) {
                animationContainer.innerHTML = '';
                animationContainer.appendChild(fragment);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [dimensions]); // Rerun effect when dimensions change

    return (
        <pre 
            ref={animationContainerRef} 
            className={`w-full h-full m-0 p-0 bg-black text-orange-500 font-mono text-sm leading-tight whitespace-pre overflow-hidden ${className || ''}`}
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
      <div className="w-full lg:w-[70%] h-[70vh] lg:h-full p-8 flex flex-col justify-start pt-12 lg:pt-8 lg:justify-center items-center order-1 overflow-y-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold">My Application</h1>
            <p className="text-xl text-gray-400">Welcome to the new layout!</p>
          </header>
      </div>

      {/* Animation Panel (Right on Desktop, Bottom on Mobile) */}
      <div className="w-full h-[30vh] lg:w-[30%] lg:h-full order-2">
         <CodeRainAnimation />
      </div>

    </div>
  );
}

export default App;
