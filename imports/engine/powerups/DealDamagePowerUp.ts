import type { GameEngine } from '../GameEngine';
import { PowerUp, type powerUpDataInput } from './Powerup';
import { powerUpRegistry } from './PowerupRegistry';

const DAMAGE = 20;

export class DealDamagePowerUp extends PowerUp {
  constructor(data: powerUpDataInput = {}) {
    super({
      powerUpId: 'deal-damage-power-up',
      name: 'Deal Damage',
      description: `Deal ${DAMAGE} damage to the enemy.`,
      icon: '',
      tier: 'common',
      maxStacks: 1,
      currentStacks: 0,
      available: true,
      ...data,
    });
  }

  apply(engine: GameEngine): void {
    if (!this.isAvailable()) {
      throw new Error('Deal Damage powerup is unavailable');
    }

    engine.enemy.currentHealth = Math.max(0, engine.enemy.currentHealth - DAMAGE);
    this.currentStacks = 1;
    this.available = false;
  }
}

powerUpRegistry.register('deal-damage-power-up', DealDamagePowerUp);
