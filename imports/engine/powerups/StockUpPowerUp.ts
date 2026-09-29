import type { GameEngine } from '../GameEngine';
import { cardRegistry } from '../card/CardRegistry';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';
import { Blank } from '../card/Blank';

const NUM_CARDS_ADDED = 5;

export class StockUpPowerUp extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'stock-up',
      name: 'Stock Up',
      description: `Add ${NUM_CARDS_ADDED} copies of "Blank" to your deck.`,
      icon: '',
      available: true,
      consumedOnUse: false,
      ...data,
    });
  }

  apply(engine: GameEngine): void {
    if (!this.isAvailable()) {
      throw new Error('Stock Up powerup is unavailable');
    }

    const CARD = new Blank();

    for (let i = 0; i < NUM_CARDS_ADDED; i++) {
      engine.deck.push(cardRegistry.create({
        ...CARD.toJSON(),
        uniqueId: undefined,
      }));
    }

    this.available = false;
  }
}

powerUpRegistry.register('stock-up', StockUpPowerUp);
