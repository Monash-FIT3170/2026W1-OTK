// Ninja.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';

export class Ninja extends Enemy {
  static enemyId = 'ninja';

  public attacksReceived: number;

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
    this.attacksReceived = data.attacksReceived ?? 0;
  }

  override takeDamage(amount: number): void {
    this.attacksReceived++;
    if (this.attacksReceived % 3 === 0) {
        super.takeDamage(0)
    } else {
        super.takeDamage(amount)
    }
  }

  override toJSON(): EnemyData {
    return { ...super.toJSON(), attacksReceived: this.attacksReceived };
  }
}

enemyRegistry.register(Ninja.enemyId, Ninja);
