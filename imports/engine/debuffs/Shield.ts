import type { GameEngine } from '../GameEngine';
import type { Enemy } from '../enemy/Enemy';
import { Debuff, type debuffData } from './Debuff';
import { debuffRegistry } from './DebuffRegistry';

export class Shield extends Debuff {
  static readonly SHIELD_LAYERS = 3;

  constructor(data: Partial<debuffData> = {}) {
    super({
      debuffId: 'shield',
      name: 'Shield',
      debuffAnimation: 'shield',
      ...data,
    });
  }

  override applyTo(enemy: Enemy): void {
    super.applyTo(enemy);

    if (enemy.shieldLayers === 0) {
      enemy.shieldLayers = Shield.SHIELD_LAYERS;

      enemy.health += Shield.SHIELD_LAYERS;
      enemy.currentHealth += Shield.SHIELD_LAYERS;
    }
  }

  activateDebuff(engine: GameEngine): void {}

  override modifyIncomingDamage(enemy: Enemy, amount: number): number {
    if (amount <= 0) return 0;
    if (enemy.shieldLayers <= 0) return amount;

    const shieldThreshold = enemy.health - enemy.shieldLayers;
    const shieldRemaining = Math.max(0, enemy.currentHealth - shieldThreshold);
    return shieldRemaining > 0 ? 1 : amount;
  }

  static getRemainingLayers(enemy: Enemy): number {
    const shieldThreshold = enemy.health - enemy.shieldLayers;
    return Math.max(0, enemy.currentHealth - shieldThreshold);
  }
}

debuffRegistry.register('shield', Shield);
