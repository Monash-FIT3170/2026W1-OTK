import { motion } from 'motion/react';

// Arc layout, all relative to the enemy sprite's box (% of its width/height).
// Tweak these to reposition the shields.
const ARC = {
  centerX: 50, // arc centre, % from the sprite's left edge
  centerY: 50, // arc centre, % from the sprite's top edge
  radiusX: 80, // horizontal radius, % of sprite width
  radiusY: 70, // vertical radius, % of sprite height
  spread: 120, // total angle the arc covers, in degrees
  size: 50, // each shield's width, % of sprite width
};

const BREAK_FLASH = {
  filter: [
    'brightness(1)',
    'brightness(0) invert(1)',
    'brightness(0) invert(1)',
  ],
  opacity: [1, 1, 0],
};

export default function ShieldLayers({ enemy }) {
  if (!enemy.debuffs.includes('shield')) return null;

  const threshold = enemy.health - enemy.shieldLayers;
  const remaining = Math.max(0, enemy.currentHealth - threshold);
  const count = enemy.shieldLayers;

  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: count }, (_, i) => {
        const angle =
          count > 1 ? -ARC.spread / 2 + (ARC.spread * i) / (count - 1) : 0;
        const rad = (angle * Math.PI) / 180;
        const broken = i >= remaining;
        return (
          <motion.img
            key={i}
            src="/assets/sprites/enemies/turtle-shield.png"
            alt=""
            className="absolute"
            style={{
              left: `${ARC.centerX + ARC.radiusX * Math.sin(rad)}%`,
              top: `${ARC.centerY - ARC.radiusY * Math.cos(rad)}%`,
              width: `${ARC.size}%`,
              x: '-50%',
              y: '-50%',
              rotate: angle,
              imageRendering: 'pixelated',
            }}
            // initial={false}: shields already broken on mount stay hidden
            // instead of replaying the flash.
            initial={false}
            animate={
              broken ? BREAK_FLASH : { filter: 'brightness(1)', opacity: 1 }
            }
            transition={{ duration: 0.5, times: [0, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
}
