// Undying.ts
// Stage 3 boss. Has a shield that negates all damage.

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';
import { debuffRegistry, Shield } from '../../debuffs';

export class Undying extends Enemy {
  static enemyId = 'undying';

  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 140;

    super({
      enemyId: Undying.enemyId,
      name: data.name ?? 'Undying',
      health,
      currentHealth: data.currentHealth ?? health,
      debuffs: data.debuffs ?? [],
      entryAnimation: data.entryAnimation ?? 'drop',
      hitAnimation: data.hitAnimation ?? 'squish',
      timerDebuffActive: data.timerDebuffActive,
      timerDebuffDeadline: data.timerDebuffDeadline,
      timerDebuffInterval: data.timerDebuffInterval,
      timerDebuffTickAmount: data.timerDebuffTickAmount,
      damageTakenCount: data.damageTakenCount,
      shieldLayers: data.shieldLayers,
    });

    // Undying saves created before Shield was introduced have no debuff ID.
    debuffRegistry.create('shield').applyTo(this);
  }
}

enemyRegistry.register(Undying.enemyId, Undying);
