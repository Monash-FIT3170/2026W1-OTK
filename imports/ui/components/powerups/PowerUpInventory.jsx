import React from 'react';
import { Meteor } from 'meteor/meteor';
import { PowerUp } from './PowerUp';

/**
 * The player's collected power-ups, shown top-left during battle. Clicking
 * one consumes it - the server removes it from the inventory after applying
 * its effect.
 *
 * @param {string[]} powerUps - powerUpIds collected so far this run
 */
export function PowerUpInventory({ powerUps = [] }) {
  if (powerUps.length === 0) return null;

  const handleUse = (index) => {
    Meteor.call('game.usePowerUp', index, (err) => {
      if (err) console.error('game.usePowerUp failed:', err);
    });
  };

  return (
    <div className="flex flex-row gap-2 bg-black/40 rounded-xl p-2">
      {powerUps.map((powerUpId, index) => (
        <PowerUp
          key={index}
          powerUpId={powerUpId}
          onClick={() => handleUse(index)}
        />
      ))}
    </div>
  );
}
