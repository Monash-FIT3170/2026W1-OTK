import React from 'react';
import { powerupRegistry } from '../../../engine/powerups';

/**
 * The 3 selectable power-up rewards shown on the stage-clear screen.
 *
 * @param {string[]} powerUpChoices - powerUpIds offered (may repeat)
 * @param {number|null} selectedIndex - index into powerUpChoices, or null
 * @param {(index: number) => void} onSelect
 */
export function PowerUpChoices({ powerUpChoices, selectedIndex, onSelect }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-slate-300 text-sm uppercase tracking-wide">
        Choose a Power-Up
      </p>
      <div className="flex flex-row gap-5">
        {powerUpChoices.map((powerUpId, index) => {
          const powerUp = powerupRegistry.create(powerUpId);
          const isSelected = index === selectedIndex;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              className={`flex flex-col items-center gap-2 w-40 rounded-2xl border-2 px-4 py-4 transition-colors ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-900/40'
                  : 'border-slate-600 bg-slate-800/60 hover:border-slate-400'
              }`}
            >
              <img
                src={powerUp.icon}
                alt={powerUp.name}
                className="h-16 w-16 object-contain"
                style={{ imageRendering: 'pixelated' }}
                draggable={false}
              />
              <span className="text-white font-semibold text-sm text-center">
                {powerUp.name}
              </span>
              <span className="text-slate-400 text-xs leading-snug text-center">
                {powerUp.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
