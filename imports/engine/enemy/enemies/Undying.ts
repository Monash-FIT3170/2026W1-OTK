// Undying.ts
// Stage ?? boss, basically has a shield that negates all damage.

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';
import { debuffRegistry, Shield } from '../../debuffs';

export class Undying extends Enemy {
  static enemyId = 'undying';
  static shieldLayers = 3; //player should use 3 low-damage damaging cards to clear shield
  static baseHealth = 140;

  constructor(data: Partial<EnemyData> = {}) {
    const shieldLayers = data.shieldLayers ?? Undying.shieldLayers;
    const health = data.health ?? Undying.baseHealth + shieldLayers;

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
      shieldLayers,
    });

    // Undying saves created before Shield was introduced have no debuff ID.
    debuffRegistry.create('shield').applyTo(this);
  }

  get shieldTreshold(): number {
    return this.health - this.shieldLayers;
  }

  get shieldRemaining(): number {
    return new Shield().getRemainingLayers(this);
  }
}

enemyRegistry.register(Undying.enemyId, Undying);
