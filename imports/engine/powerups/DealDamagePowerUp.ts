import type { GameEngine } from '../GameEngine';
import { Powerup, type PowerupData } from './Powerup';
import { powerupRegistry } from './PowerupRegistry';

const DAMAGE = 20;

export class DealDamagePowerUp extends Powerup {
  constructor(data: Partial<PowerupData> = {}) {
    super({
      powerupId: 'deal-damage-power-up',
      name: 'Deal Damage',
      description: `Deal ${DAMAGE} damage to the enemy.`,
      tier: 'common',
      maxStacks: 1,
      currentStacks: 0,
      available: true,
      ...data,
    });
  }

  applyTo(engine: GameEngine): void {
    if (!this.isAvailable()) {
      throw new Error('Deal Damage powerup is unavailable');
    }

    engine.enemy.currentHealth = Math.max(0, engine.enemy.currentHealth - DAMAGE);
    this.currentStacks = 1;
    this.available = false;
  }
}

powerupRegistry.register('deal-damage-power-up', DealDamagePowerUp);
