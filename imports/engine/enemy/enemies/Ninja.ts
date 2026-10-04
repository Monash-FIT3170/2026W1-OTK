// Ninja.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';
import { debuffRegistry } from '../../debuffs';

export class Ninja extends Enemy {
  static enemyId = 'ninja';

  constructor(data: Partial<EnemyData> = {}) {
    super({
      enemyId: Ninja.enemyId,
      name: data.name ?? 'Ninja',
      health: data.health ?? 100,
      currentHealth: data.currentHealth ?? data.health ?? 100,
      debuffs: data.debuffs ?? [],
      entryAnimation: data.entryAnimation ?? 'drop',
      hitAnimation: data.hitAnimation ?? 'squish',
      timerDebuffActive: data.timerDebuffActive,
      timerDebuffDeadline: data.timerDebuffDeadline,
      timerDebuffInterval: data.timerDebuffInterval,
      timerDebuffTickAmount: data.timerDebuffTickAmount,
      damageTakenCount: data.damageTakenCount ?? data.attacksReceived,
    });

    // Migrate existing saves, which stored attacksReceived without a debuff ID.
    if (data.debuffs === undefined || data.attacksReceived !== undefined) {
      debuffRegistry.create('evasion').applyTo(this);
    }
  }
}

enemyRegistry.register(Ninja.enemyId, Ninja);
