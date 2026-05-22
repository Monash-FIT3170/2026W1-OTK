import { useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'motion/react';

// All game components are authored against this resolution.
// Child components use fixed px values; the scale transform handles the rest.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

export function GameBackground({backgroundScene, children }) {
  const containerRef = useRef(null);
  const scale = useMotionValue(1);

  // Recompute scale whenever the window resizes (aspect ratio stays at 16:9)
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        scale.set(containerRef.current.offsetWidth / DESIGN_WIDTH);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ width: 'min(100vw, 177.78vh)', height: 'min(100vh, 56.25vw)' }}
      >
        <img
          src={`/assets/environments/${backgroundScene}-background.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ imageRendering: 'pixelated' }}
        />
        {/* Content canvas: authored at 1920x1080, scaled down to fit the container */}
        <motion.div
          className="relative flex flex-col"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            scale,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
