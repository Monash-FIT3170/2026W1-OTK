import React from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

export default function Card({ cardProps }) {
  const costFontColour =
    cardProps.currentCost != cardProps.baseCost
      ? 'text-lime-700'
      : 'text-blue-700';
  const attackFontColour =
    cardProps.currentAttack != cardProps.baseAttack
      ? 'text-lime-700'
      : 'text-red-700';

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = () => {
    // Animate back to origin
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 20 });
  };

  return (
    <motion.div>
      <motion.div
        whileHover={{
          scale: 1.1,
          backgroundColor: 'oklch(90.5% 0.233 277.117)',
        }}
        whileTap={{ scale: 0.95 }}
        drag
        onDragEnd={handleDragEnd}
        dragMomentum={false}
        style={{ x, y }}
        onDragEnd={handleDragEnd}
        className="flex flex-col gap-2 bg-slate-400 rounded-xl shadow-md p-2 aspect-5/7 min-w-40 min-h-50 max-h-1/7 max-w-1/8 box-border border-slate-600 border-1"
      >
        <div
          className="flex flex-2/12 min-h-5 justify-center box-border border-1 bg-slate-300 box-border border-slate-600 border-1 font-mono 
        font-semibold tracking-wide truncate min-w-0"
        >
          {cardProps.name}
        </div>
        <div className="flex flex-4/10 flex-row gap-3 grow-0">
          <div className="flex flex-1/6 flex flex-col gap-0.5 grow-0 min-w-0">
            <div className="flex box-border border-1 border-blue-800 aspect-square bg-blue-300 rounded-xl justify-center-safe font-mono text-ellipsis z-2">
              <p className={costFontColour}>{cardProps.currentCost} </p>
            </div>
            {cardProps.currentAttack !== null && (
              <div className="flex box-border border-1 border-red-800 aspect-square bg-red-300 rounded-xl justify-center-safe font-mono text-ellipsis z-2">
                <p className={attackFontColour}>{cardProps.currentAttack}</p>
              </div>
            )}
          </div>
          <div className="flex flex-1/6 box-border border-slate-600 border-1 aspect-5/4">
            <img
              draggable={false}
              src="https://assetsio.gnwcdn.com/pokemon-tcg-25th-anniversary-pikachu-base-set-artwork.png?width=690&quality=85&format=jpg&dpr=3&auto=webp"
            />
            {/* TODO - Placeholder image */}
          </div>
        </div>
        <div
          className="flex flex-7/10 min-h-20 box-border border-1 bg-slate-300 box-border border-slate-600 border-1 font-mono 
        tracking-tighter text-ellipsis overflow-y-clip text-sm grow-3"
        >
          <p className="ml-1 mt-1">{cardProps.description}</p>
        </div>
      </motion.div>

      {/* {cardProps.getName()} */}
    </motion.div>
  );
}
