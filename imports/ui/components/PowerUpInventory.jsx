import React from 'react';
import { powerUpRegistry } from '../../engine/powerups';

/**
 * The player's collected power-ups, shown top-left during battle.
 *
 * @param {string[]} powerUps - powerUpIds collected so far this run
 */
export function PowerUpInventory({ powerUps = [] }) {
  if (powerUps.length === 0) return null;

  return (
    <div className="flex flex-row gap-2 bg-black/40 rounded-xl p-2">
      {powerUps.map((powerUpId, index) => {
        const powerUp = powerUpRegistry.create(powerUpId);
        return (
          <img
            key={index}
            src={powerUp.icon}
            alt={powerUp.name}
            title={`${powerUp.name} - ${powerUp.description}`}
            className="h-12 w-12 object-contain rounded-lg border border-slate-500 bg-slate-800/80"
            style={{ imageRendering: 'pixelated' }}
            draggable={false}
          />
        );
      })}
    </div>
  );
}
