import type { GameEngine } from '../GameEngine';
import { cardRegistry } from '../card/CardRegistry';
import { Card } from '../card/Card';
import { PowerUp, type powerUpDataInput } from './Powerup';
import { powerUpRegistry } from './PowerupRegistry';

export class DuplicateCardsPowerUp extends PowerUp {
  constructor(data: powerUpDataInput = {}) {
    super({
      powerUpId: 'duplicate-cards',
      name: 'Duplicate Cards',
      description: 'Duplicate two cards in your hand, at random.',
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
      throw new Error('Duplicate Cards powerup is unavailable');
    }

    if (engine.hand.length > 0) {
      this.duplicateCard(engine, engine.hand);
      this.duplicateCard(engine, engine.hand);

      this.available = false;
    }
  }

  private duplicateCard(engine: GameEngine, hand: Card[]): void {
    const card = hand[Math.floor(Math.random() * hand.length)];

    const newCard = cardRegistry.create({
        ...card.toJSON(),
        uniqueId: undefined,
      });
    newCard.isFrozen = false;

    engine.addToHand(newCard);
  }
}

powerUpRegistry.register('duplicate-cards', DuplicateCardsPowerUp);
