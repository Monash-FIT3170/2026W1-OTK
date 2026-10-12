import type { GameEngine } from '../GameEngine';
import { cardRegistry } from '../card/CardRegistry';
import { Card } from '../card/Card';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';

export class DuplicateCardsPowerUp extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'duplicate-cards',
      name: 'Duplicate Cards',
      description: 'Duplicate two cards in your hand, at random.',
      icon: '/assets/sprites/powerups/duplicate-pu-sprite.png',
      available: true,
      consumedOnUse: false,
      ...data,
    });
  }

  apply(engine: GameEngine): boolean {
    if (engine.hand.length === 0) return false;

    this.duplicateCard(engine, engine.hand);
    this.duplicateCard(engine, engine.hand);
    return true;
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
