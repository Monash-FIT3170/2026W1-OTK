import type { GameEngine } from '../GameEngine';
import { cardRegistry } from '../card/CardRegistry';
import { Card } from '../card/Card';
import { PowerUp, type powerUpDataInput } from './Powerup';
import { powerUpRegistry } from './PowerupRegistry';

export class OneMorePullPowerUp extends PowerUp {
  constructor(data: powerUpDataInput = {}) {
    super({
      powerUpId: 'one-more-pull',
      name: 'One More Pull',
      description: 'Draws one card',
      icon: '',
      tier: 'common',
      maxStacks: 1,
      currentStacks: 1,
      available: true,
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
