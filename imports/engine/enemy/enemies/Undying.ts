// Undying.ts
// Stage ?? boss, basically has a shield that negates all damage.

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';

export class Undying extends Enemy {
  static enemyId = 'undying';
  static shieldLayers = 3; //player should use 3 low-damage damaging cards to clear shield
  static baseHealth = 140;


  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? Undying.baseHealth+Undying.shieldLayers;

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
    });
  }
  get shieldTreshold(): number {
    return this.health-Undying.shieldLayers;
  }
  get shieldRemaining(): number {
    return Math.max(0, this.currentHealth-this.shieldTreshold);
  }

  override takeDamage(amount: number): void {
    if (amount <= 0) return;
    if (this.shieldRemaining > 0){ //the shield clearing strategy
      super.takeDamage(1);
      return;
    }
    super.takeDamage(amount);
  }
}

enemyRegistry.register(Undying.enemyId, Undying);
