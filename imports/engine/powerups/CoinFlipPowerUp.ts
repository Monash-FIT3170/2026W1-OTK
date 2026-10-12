import type { GameEngine } from '../GameEngine';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';

const HEADS_CHANCE = 0.5;

export class CoinFlipPowerUp extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'coin-flip',
      name: 'Coin Flip',
      description: 'Flip a coin. Heads: the enemy loses half its current health. Tails: nothing happens.',
      icon: '',
      available: true,
      consumedOnUse: false,
      ...data,
    });
  }

  apply(engine: GameEngine): void {
    if (!this.isAvailable()) {
      throw new Error('Coin Flip powerup is unavailable');
    }

    if (Math.random() < HEADS_CHANCE) {
      const damage = Math.ceil(engine.enemy.currentHealth / 2);
      engine.enemy.currentHealth = Math.max(0, engine.enemy.currentHealth - damage);
    }

    this.available = false;
  }
}

powerUpRegistry.register('coin-flip', CoinFlipPowerUp);
