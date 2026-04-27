import React from 'react';
import { EnemyDisplay } from './components/EnemyDisplay';

export const App = () => (
  <div className="page">
    <EnemyDisplay enemy={{ enemyId: 1, name: 'Goblin', health: 50 }} isVisible={true} />
  </div>
);
