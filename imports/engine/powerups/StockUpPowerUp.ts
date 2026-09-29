import type { GameEngine } from '../GameEngine';
import { cardRegistry } from '../card/CardRegistry';
import { PowerUp, type powerUpDataInput } from './Powerup';
import { powerUpRegistry } from './PowerupRegistry';
import { Blank } from '../card/Blank';

export class StockUpPowerUp extends PowerUp {
  constructor(data: powerUpDataInput = {}) {
    super({
      powerUpId: 'stock-up',
      name: 'Stock Up',
      description: 'Add 5 copies of "Blank" to your deck.',
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
      throw new Error('Stock Up powerup is unavailable');
    }

    const NUM_CARDS_ADDED = 5;
    const CARD = new Blank();

    for (let i = 0; i < NUM_CARDS_ADDED; i++) {
      engine.deck.push(cardRegistry.create({
        ...CARD.toJSON(),
        uniqueId: undefined,
      }));
    }
  }
}

powerUpRegistry.register('stock-up', StockUpPowerUp);
