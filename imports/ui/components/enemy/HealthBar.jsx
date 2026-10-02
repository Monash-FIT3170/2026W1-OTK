import React from 'react';
import { Undying } from '../../../engine/enemy/enemies/Undying';

export const HealthBar = ({ current, max, name }) => {
  const healthPercentage = (current / max) * 100;
  
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-green-500';
    if (healthPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="health-bar-container mb-4">
      <div className="flex justify-center items-center mb-2">
        <span
          style={{
            fontFamily: 'var(--game-font)', fontSizeAdjust: 'var(--game-font-adjust)',
            textShadow: '1px 1px 0 #000',
          }}
          className="text-white text-4xl leading-none tracking-wide bg-black/60 px-4 py-1 border-2 border-black/80"
        >
          {name}
        </span>
      </div>
      <div className="relative w-full bg-red-900 rounded-none h-10 overflow-hidden shadow-md">
        <div
          className={`h-full ${getHealthColor()} transition-all duration-300`}
          style={{ width: `${healthPercentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            style={{ fontFamily: 'var(--game-font)', fontSizeAdjust: 'var(--game-font-adjust)', textShadow: '1px 1px 0 #000' }}
            className="text-white text-3xl leading-none"
          >
            {current}/{max}
          </span>
        </div>
      </div>
    </div>
  );
};

//implementation to be generalised in the future if 
// more enemies with shields is planned
//avoiding overengineering for now
const getBarValues = (enemy) => {
  if (enemy.enemyId === Undying.enemyId) { 
    const threshold = enemy.health - Undying.shieldLayers;
    return { current: Math.min(enemy.currentHealth, threshold), max: threshold };
  }
  return { current: enemy.currentHealth, max: enemy.health };
};

export const EnemyHealthBar = ({ enemy }) => {
  const { current, max } = getBarValues(enemy);
  return <HealthBar current={current} max={max} name={enemy.name} />;
};