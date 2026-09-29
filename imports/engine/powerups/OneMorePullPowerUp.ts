import type { GameEngine } from '../GameEngine';
import { Card } from '../card/Card';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';

export class OneMorePullPowerUp extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'one-more-pull',
      name: 'One More Pull',
      description: 'Draws one card',
      icon: '',
      available: true,
      consumedOnUse: false,
      ...data,
    });
  }

  apply(engine: GameEngine): void {
    if (!this.isAvailable()) {
      throw new Error('One More Pull powerup is unavailable');
    }

    if (engine.deck.length > 1) {
      this.oneMorePull(engine, engine.hand);
      this.available = false;
    }
  }

  private oneMorePull(engine: GameEngine, hand: Card[]): void {
    engine.draw(1);
  }
}

powerUpRegistry.register('one-more-pull', OneMorePullPowerUp);
