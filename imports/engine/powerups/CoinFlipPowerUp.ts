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
      icon: '/assets/sprites/powerups/coin-flip-pu-sprite.png',
      available: true,
      consumedOnUse: false,
      ...data,
    });
  }

  apply(engine: GameEngine): boolean {
    if (Math.random() < HEADS_CHANCE) {
      const damage = Math.ceil(engine.enemy.currentHealth / 2);
      engine.enemy.currentHealth = Math.max(0, engine.enemy.currentHealth - damage);
    }

    return true;
  }
}

powerUpRegistry.register('coin-flip', CoinFlipPowerUp);
