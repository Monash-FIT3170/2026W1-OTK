import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { EnemyList } from './components';
import { EnemyDisplay } from './components/EnemyDisplay';
import { Goblin } from 'imports/engine/enemy/enemies/Goblin';
import { HealthBar } from './components/HealthBar';

export const App = () => {
  const [enemy, setEnemy] = useState(new Goblin());
  const [isTakingDamage, setIsTakingDamage] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // NOTE: do not use this handle attack method in the game, use the enemy.damage method to apply damage
  const handleAttack = () => {
    setEnemy(prev => {
      const newHealth = prev.currentHealth - 5;
      newHealth <= 0 ? setIsVisible(false) : setIsVisible(true);
      const updated = new Goblin({ ...prev, currentHealth: newHealth });
      return updated;
    });

    setIsTakingDamage(true);
    setTimeout(() => setIsTakingDamage(false), 400);
  };

  return (
    <div className="page">
                  <HealthBar
                    current={enemy.currentHealth}
                    max={enemy.health}
                    name={enemy.name}
                  />
      <EnemyDisplay enemy={enemy} isVisible={isVisible} isTakingDamage={isTakingDamage} />
      <button onClick={handleAttack}>Attack</button>
    </div>
  );
};
