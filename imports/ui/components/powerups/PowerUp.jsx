import React from 'react';
import { powerupRegistry } from '../../../engine/powerups';

/**
 * A single power-up icon button. Looks up its display data from the
 * registry by id - callers only need to track the id.
 *
 * @param {string} powerUpId
 * @param {() => void} onClick
 */
export function PowerUp({ powerUpId, onClick }) {
  const powerUp = powerupRegistry.create(powerUpId);

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${powerUp.name} - ${powerUp.description}`}
      className="rounded-lg border border-slate-500 bg-slate-800/80 hover:border-emerald-400 transition-colors"
    >
      <img
        src={powerUp.icon}
        alt={powerUp.name}
        className="h-12 w-12 object-contain"
        style={{ imageRendering: 'pixelated' }}
        draggable={false}
      />
    </button>
  );
}
