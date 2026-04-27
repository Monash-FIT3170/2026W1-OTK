import React, { useState } from 'react';
import { EnemyDisplay } from './components/EnemyDisplay';
import { Goblin } from 'imports/engine/enemy/enemies/Goblin';

export const App = () => {
  const [enemy, setEnemy] = useState(new Goblin());
  const [isTakingDamage, setIsTakingDamage] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Added an attack button to demonstrate the hit and exit animations.
  const handleAttack = () => {
    setEnemy(prev => {
      const newHealth = prev.health - 5;
      newHealth <= 0 ? setIsVisible(false) : setIsVisible(true);
      const updated = new Goblin({ ...prev, health: newHealth });
      return updated;
    });

    setIsTakingDamage(true);
    setTimeout(() => setIsTakingDamage(false), 400);
  };

  return (
    <div className="page">
      <EnemyDisplay enemy={enemy} isVisible={isVisible} isTakingDamage={isTakingDamage} />
      <button onClick={handleAttack}>Attack</button>
    </div>
  );
};