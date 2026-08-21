// Tutorial training dummy enemy class

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';

export class TrainingDummy extends Enemy {
  static enemyId = 'trainingDummy';

  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 200;

    super({
      enemyId: TrainingDummy.enemyId,
      name: data.name ?? 'Training Dummy',
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

  override takeDamage(amount: number): void {
    super.takeDamage(amount);
    // Training dummy does not die, it just resets to full health
    if (this.currentHealth <= 0) {
      this.currentHealth = this.health;
    }
  }
}

enemyRegistry.register(TrainingDummy.enemyId, TrainingDummy);
