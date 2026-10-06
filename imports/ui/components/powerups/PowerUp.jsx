import React from 'react';
import { PowerUp as EnginePowerUp } from '../../../engine/powerups/PowerUp';

/**
 * A single power-up icon button. Looks up its display data from the
 * registry by id - callers only need to track the id.
 *
 * @param {EnginePowerUp} powerUp
 * @param {() => void} onClick
 */
export function PowerUp({ powerUp, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!powerUp.available}
      title={`${powerUp.name} - ${powerUp.description}${!powerUp.available ? "\n(Already used this stage)" : ""}`}
      className={`rounded-lg border border-slate-500 bg-slate-800/80 hover:border-emerald-400 transition-colors ${!powerUp.available ? "cursor-not-allowed" : ""}`}
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
