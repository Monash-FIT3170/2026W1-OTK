import React from 'react';
import { HealthBar } from './HealthBar';
import { EnemyDisplay } from './EnemyDisplay';

export const EnemyList = ({ enemies }) => {
  if (!enemies || enemies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No enemies spawned yet
      </div>
    );
  }

  return (
    <div className="enemies-list">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Enemies</h2>
      <div className="space-y-4">
        {enemies.map((enemy) => (
          <div
            key={enemy._id}
            className="enemy-card bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <HealthBar
              current={enemy.currentHealth}
              max={enemy.health}
              name={enemy.name}
            />
            <EnemyDisplay 
              enemy={enemy}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
