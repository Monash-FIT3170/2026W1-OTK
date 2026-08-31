// Goblin.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';

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

    // The stage 1 boss is deliberately debuff-free - it is the run's tutorial
    // fight. Debuffs are a per-enemy property; see Frostwarden and Timekeeper.
  }
}

enemyRegistry.register(Goblin.enemyId, Goblin);
