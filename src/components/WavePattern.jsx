import React, { useEffect, useRef } from 'react';

/**
 * A self-contained, reusable React component that renders an interactive
 * triple-slit wave interference pattern using Tailwind CSS for styling.
 * It is responsive and will adapt its orientation based on the container's aspect ratio.
 * @param {object} props - Standard React props. `className` will be passed to the container.
 */
const WavePattern = ({ className, ...props }) => {
    // A ref to get a direct handle on the animation container DOM element
    const animationContainerRef = useRef(null);
    // A ref to hold the animation frame ID so it can be cancelled on cleanup
    const animationFrameId = useRef(null);

    // useEffect hook runs after the component mounts. This is where we
    // set up and manage the animation lifecycle.
    useEffect(() => {
        /**
         * A simple debounce function to prevent the resize handler from firing too often,
         * which can be performance-intensive.
         */
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        /**
         * This function sets up and runs the entire animation. It is called on mount
         * and whenever the window is resized.
         */
        const setupAndRunAnimation = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }

            const animationContainer = animationContainerRef.current;
            if (!animationContainer) return;

            animationContainer.innerHTML = ''; // Clear previous content

            // The animation will switch from horizontal to vertical if the container is taller than it is wide.
            const isVerticalLayout = animationContainer.clientHeight > animationContainer.clientWidth;

            const config = {
                cols: Math.floor(animationContainer.clientWidth / 7.2),
                rows: Math.floor(animationContainer.clientHeight / 12),
                wavelength: 10,
                waveSpeed: 1.5,
                k: (2 * Math.PI) / 10,
                slitPosition: 0,
                slits: []
            };

            if (isVerticalLayout) {
                // Vertical Flow Configuration
                config.slitPosition = Math.floor(config.rows / 2);
                const slitSeparation = 0.3 * config.cols;
                config.slits = [
                    { y: config.slitPosition, x: Math.floor(config.cols / 2 - slitSeparation) },
                    { y: config.slitPosition, x: Math.floor(config.cols / 2) },
                    { y: config.slitPosition, x: Math.floor(config.cols / 2 + slitSeparation) }
                ];
            } else {
                // Horizontal Flow Configuration
                config.slitPosition = Math.floor(config.cols / 1.5);
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
                        let isWallPoint = isVerticalLayout ? (r === config.slitPosition) : (c === config.slitPosition);
                        let isSourceSide = isVerticalLayout ? (r < config.slitPosition) : (c < config.slitPosition);
                        if (isWallPoint) {
                            const isSlit = config.slits.some(slit => isVerticalLayout ? (Math.abs(c - slit.x) < 4) : (Math.abs(r - slit.y) < 2));
                            wall[r][c] = { char: isSlit ? ' ' : (isVerticalLayout ? '━' : '┃'), style: { color: '#fdf6e3' } };
                        } else if (isSourceSide) {
                            wall[r][c] = { char: ' ', style: {} };
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
                                totalAmplitude += Math.sin(phase) / Math.max(1, distance);
                            });
                            const intensity = totalAmplitude * totalAmplitude;
                            const clampedIntensity = Math.min(1, Math.max(0, 40 * intensity));
                            const charIndex = Math.floor(clampedIntensity * (asciiChars.length - 1));
                            const hue = totalAmplitude > 0 ? 40 : 0;
                            const lightness = 30 + Math.pow(clampedIntensity, 0.7) * 50;
                            const color = `hsl(${hue}, 90%, ${lightness}%)`;
                            cell = { char: asciiChars[charIndex], style: { color: color } };
                        }
                        span.textContent = cell.char;
                        // Spans are created dynamically, so style is still applied directly
                        span.style.color = cell.style.color;
                        fragment.appendChild(span);
                    }
                    fragment.appendChild(document.createElement('br'));
                }
                if (animationContainer) {
                    animationContainer.innerHTML = '';
                    animationContainer.appendChild(fragment);
                }
                time += 0.2;
                animationFrameId.current = requestAnimationFrame(animate);
            };

            animate();
        };

        // --- Initial Run and Event Listeners ---
        setupAndRunAnimation();
        const debouncedHandler = debounce(setupAndRunAnimation, 250);
        window.addEventListener('resize', debouncedHandler);

        // Cleanup function to remove event listeners and cancel animation frame
        return () => {
            window.removeEventListener('resize', debouncedHandler);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []); // The empty dependency array [] ensures this effect runs only once on mount

    return (
        // The inline <style> tag has been replaced with Tailwind CSS classes.
        <pre 
            ref={animationContainerRef} 
            className={`w-full h-full m-0 p-0 bg-black text-[#fdf6e3] font-mono text-xs leading-none whitespace-pre overflow-hidden ${className || ''}`}
            {...props}
        />
    );
};

export default WavePattern;
