// Ninja.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';

export class Ninja extends Enemy {
  static enemyId = 'ninja';

  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 100;
    console.log('NINJA CONSTRUCTOR');
    super({
      enemyId: Ninja.enemyId,
      name: data.name ?? 'Ninja',
      health,
      currentHealth: data.currentHealth ?? health,
      debuffs: data.debuffs ?? [],
      entryAnimation: data.entryAnimation ?? 'drop',
      hitAnimation: data.hitAnimation ?? 'squish',
      timerDebuffActive: data.timerDebuffActive,
      timerDebuffDeadline: data.timerDebuffDeadline,
      timerDebuffInterval: data.timerDebuffInterval,
      timerDebuffTickAmount: data.timerDebuffTickAmount,
      attacksTaken: data.attacksTaken,
    });
  }

  override takeDamage(amount: number): void {
    if (this.attacksTaken % 3 === 0 && this.attacksTaken !== 0) {
        super.takeDamage(0)
    } else {
        super.takeDamage(amount)
    }
  }
}

enemyRegistry.register(Ninja.enemyId, Ninja);
