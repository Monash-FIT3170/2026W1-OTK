// Goblin.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';

export class Goblin extends Enemy {
  static enemyId = 'goblin';

  constructor(
    data: {
      name?: string;
      health?: number;
      currentHealth?: number;
      debuffs?: string[];
      entryAnimation?: string;
      hitAnimation?: string;
    } = {}
  ) {
    const health = data.health ?? 100;
    super({
      enemyId: Goblin.enemyId,
      name: data.name ?? 'Goblin',
      health,
      currentHealth: data.currentHealth ?? health,
      debuffs: data.debuffs ?? [],
      entryAnimation: data.entryAnimation ?? 'drop',
      hitAnimation: data.hitAnimation ?? 'squish',
    });
  }
}

enemyRegistry.register('goblin', Goblin);
