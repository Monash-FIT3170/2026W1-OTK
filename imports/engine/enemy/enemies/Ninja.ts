// Ninja.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';

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
    });
  }

  override takeDamage(amount: number): void {
    if (Math.random() < 0.33) {
        super.takeDamage(0)
    } else {
        super.takeDamage(amount)
    }
  }
}

enemyRegistry.register(Ninja.enemyId, Ninja);
