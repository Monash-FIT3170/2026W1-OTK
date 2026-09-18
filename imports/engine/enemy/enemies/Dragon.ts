// Dragon.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';

export class Dragon extends Enemy {
  static enemyId = 'dragon';

  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 140;

    super({
      enemyId: Dragon.enemyId,
      name: data.name ?? 'Dragon',
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
  }
}

enemyRegistry.register(Dragon.enemyId, Dragon);
