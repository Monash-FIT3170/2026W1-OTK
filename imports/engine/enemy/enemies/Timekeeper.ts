// Timekeeper.ts
// Stage 3 boss. Carries the timer debuff.

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';
import { debuffRegistry } from '../../debuffs';

export class Timekeeper extends Enemy {
  static enemyId = 'timekeeper';

  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 140;

    super({
      enemyId: Timekeeper.enemyId,
      name: data.name ?? 'Timekeeper',
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

    // Only fresh spawns receive their default debuffs. Saved enemies restore
    // the exact debuff list provided in their serialized data.
    if (data.debuffs === undefined) {
      debuffRegistry.create('timer').applyTo(this);
    }
  }
}

enemyRegistry.register(Timekeeper.enemyId, Timekeeper);
