import { motion } from 'motion/react';

// Arc layout, all relative to the enemy sprite's box (% of its width/height).
// Tweak these to reposition the shields.
const ARC = {
  centerX: 20, // arc centre, % from the sprite's left edge
  centerY: 70, // arc centre, % from the sprite's top edge
  radiusX: 80, // horizontal radius, % of sprite width
  radiusY: 70, // vertical radius, % of sprite height
  spread: 120, // total angle the arc covers, in degrees
  size: 50, // each shield's width, % of sprite width
};

// Per-enemy overrides for any ARC value, keyed by enemyId. Only the keys
// given here change; the rest come from ARC (which is tuned for the turtle).
const ARC_OVERRIDES = {
  secretboss: { centerX: 50, centerY: 20 },
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
  const arc = { ...ARC, ...ARC_OVERRIDES[enemy.enemyId] };

  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: count }, (_, i) => {
        const angle =
          count > 1 ? -arc.spread / 2 + (arc.spread * i) / (count - 1) : 0;
        const rad = (angle * Math.PI) / 180;
        const broken = i >= remaining;
        return (
          <motion.img
            key={i}
            src="/assets/sprites/enemies/turtle-shield.png"
            alt=""
            className="absolute"
            style={{
              left: `${arc.centerX + arc.radiusX * Math.sin(rad)}%`,
              top: `${arc.centerY - arc.radiusY * Math.cos(rad)}%`,
              width: `${arc.size}%`,
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
