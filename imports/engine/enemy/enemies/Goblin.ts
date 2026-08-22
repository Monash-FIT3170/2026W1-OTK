// Goblin.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';
import { debuffRegistry } from '../../debuffs';

export class Goblin extends Enemy {
  static enemyId = 'goblin';

  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 100;

    super({
      enemyId: Goblin.enemyId,
      name: data.name ?? 'Goblin',
      health,
      currentHealth: data.currentHealth ?? health,
      debuffs: data.debuffs ?? [],
      entryAnimation: data.entryAnimation ?? 'drop',
      hitAnimation: data.hitAnimation ?? 'squish',
      timerDebuffActive: data.timerDebuffActive,
      timerDebuffDeadline: data.timerDebuffDeadline,
      timerDebuffInterval: data.timerDebuffInterval,
      timerDebuffTickAmount: data.timerDebuffTickAmount,
    });

    // Only fresh Goblins receive their default debuffs. Saved enemies restore
    // the exact debuff list provided in their serialized data.
    if (data.debuffs === undefined) {
      debuffRegistry.create('timer').applyTo(this);
      debuffRegistry.create('freeze').applyTo(this);
    }
  }
}

enemyRegistry.register('goblin', Goblin);
