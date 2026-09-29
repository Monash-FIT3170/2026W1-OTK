import type { GameEngine } from '../GameEngine';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';

const DAMAGE = 20;

export class DealDamagePowerUp extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'deal-damage-power-up',
      name: 'Deal Damage',
      description: `Deal ${DAMAGE} damage to the enemy.`,
      icon: '',
      available: true,
      consumedOnUse: false,
      ...data,
    });
  }

  apply(engine: GameEngine): void {
    if (!this.isAvailable()) {
      throw new Error('Deal Damage powerup is unavailable');
    }

    engine.enemy.currentHealth = Math.max(0, engine.enemy.currentHealth - DAMAGE);
    this.available = false;
  }
}

powerUpRegistry.register('deal-damage-power-up', DealDamagePowerUp);
