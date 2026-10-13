import type { GameEngine } from '../GameEngine';
import { DiscardEffect } from '../effect/DiscardEffect';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';

const HEADS_CHANCE = 0.5;

export class CoinFlipPowerUp extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'coin-flip',
      name: 'Coin Flip',
      description: 'Flip a coin. Heads: the enemy loses half its current health. Tails: discard a random card from your hand. One use per run.',
      icon: '/assets/sprites/powerups/coin-flip-pu-sprite.png',
      available: true,
      consumedOnUse: true,
      ...data,
    });
  }

  apply(engine: GameEngine): boolean {
    if (Math.random() < HEADS_CHANCE) {
      const damage = Math.ceil(engine.enemy.currentHealth / 2);
      engine.enemy.takeDamage(Math.max(0, damage));
    } else if (engine.hand.length > 0) {
      const card = engine.hand[Math.floor(Math.random() * engine.hand.length)];
      new DiscardEffect().resolve(engine, [card.uniqueId]);
    }

    return true;
  }
}

powerUpRegistry.register('coin-flip', CoinFlipPowerUp);
