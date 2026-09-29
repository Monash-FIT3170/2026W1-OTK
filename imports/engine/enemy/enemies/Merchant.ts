// Merchant.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';
import { debuffRegistry } from '../../debuffs';

export class Merchant extends Enemy {
  static enemyId = 'merchant';

  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 140;

    super({
      enemyId: Merchant.enemyId,
      name: data.name ?? 'Merchant',
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
      debuffRegistry.create('inflation').applyTo(this);
    }
  }
}

enemyRegistry.register(Merchant.enemyId, Merchant);
