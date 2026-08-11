// Goblin.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types'; // Import this to make typing easy!

export class Goblin extends Enemy {
  static enemyId = 'goblin';

  // 1. Change data to accept Partial<EnemyData> so it knows about the timer variables
  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 100;
    
    super({
      enemyId: Goblin.enemyId,
      name: data.name ?? 'Goblin',
      health,
      currentHealth: data.currentHealth ?? health,
      debuffs: ['timer'], 
      entryAnimation: data.entryAnimation ?? 'drop',
      hitAnimation: data.hitAnimation ?? 'squish',
      
      // 2. ADD THESE LINES: Pass the saved DB data up to the Enemy class!
      timerDebuffActive: data.timerDebuffActive,
      timerDebuffDeadline: data.timerDebuffDeadline,
      timerDebuffInterval: data.timerDebuffInterval,
      timerDebuffTickAmount: data.timerDebuffTickAmount,
    });

    // Note: I removed the manual `if` block that was down here. 
    // You don't need it! GameEngine.ts already calls `this.activateEnemyDebuffs()` 
    // when a new game starts, which automatically sets up the Timer class correctly.
  }
}

enemyRegistry.register('goblin', Goblin);