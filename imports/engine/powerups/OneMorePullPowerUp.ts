import type { GameEngine } from '../GameEngine';
import { Card } from '../card/Card';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';

export class OneMorePullPowerUp extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'one-more-pull',
      name: 'One More Pull',
      description: 'Draws one card.',
      icon: '/assets/sprites/powerups/one-more-pull-pu-sprite.png',
      available: true,
      consumedOnUse: false,
      ...data,
    });
  }

  apply(engine: GameEngine): boolean {
    if (engine.deck.length === 0) return false;

    this.oneMorePull(engine, engine.hand);
    return true;
  }

  private oneMorePull(engine: GameEngine, hand: Card[]): void {
    engine.draw(1);
  }
}

powerUpRegistry.register('one-more-pull', OneMorePullPowerUp);
