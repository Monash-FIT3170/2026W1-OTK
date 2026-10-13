// SecretBoss.ts
// Stage 7 boss. Carries all debuffs of enemies faced beforehand in the run

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';
import { debuffRegistry } from '../../debuffs';

export class SecretBoss extends Enemy {
  static enemyId = 'secretboss';

  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 200;

    super({
      enemyId: SecretBoss.enemyId,
      name: data.name ?? 'Reflection of You',
      health,
      currentHealth: data.currentHealth ?? health,
      debuffs: data.debuffs ?? [],      // Need to pass debuffs to this enemy, as it may vary
      entryAnimation: data.entryAnimation ?? 'drop',
      hitAnimation: data.hitAnimation ?? 'squish',
      timerDebuffActive: data.timerDebuffActive,
      timerDebuffDeadline: data.timerDebuffDeadline,
      timerDebuffInterval: data.timerDebuffInterval,
      timerDebuffTickAmount: data.timerDebuffTickAmount,
      damageTakenCount: data.damageTakenCount,
      shieldLayers: data.shieldLayers,
    });

    (data.debuffs ?? []).forEach(debuff => {
      debuffRegistry.create(debuff).applyTo(this);
    });
  }
}

enemyRegistry.register(SecretBoss.enemyId, SecretBoss);
