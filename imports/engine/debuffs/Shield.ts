import type { GameEngine } from '../GameEngine';
import type { Enemy } from '../enemy/Enemy';
import { Debuff, type debuffData } from './Debuff';
import { debuffRegistry } from './DebuffRegistry';

export class Shield extends Debuff {
  constructor(data: Partial<debuffData> = {}) {
    super({
      debuffId: 'shield',
      name: 'Shield',
      debuffAnimation: 'shield',
      ...data,
    });
  }

  activateDebuff(engine: GameEngine): void {}

  override modifyIncomingDamage(enemy: Enemy, amount: number): number {
    if (amount <= 0) return 0;
    if (enemy.shieldLayers <= 0) return amount;

    const shieldThreshold = enemy.health - enemy.shieldLayers;
    const shieldRemaining = Math.max(0, enemy.currentHealth - shieldThreshold);
    return shieldRemaining > 0 ? 1 : amount;
  }

  getRemainingLayers(enemy: Enemy): number {
    const shieldThreshold = enemy.health - enemy.shieldLayers;
    return Math.max(0, enemy.currentHealth - shieldThreshold);
  }
}

debuffRegistry.register('shield', Shield);
