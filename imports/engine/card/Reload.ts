/**
 * Reload Card
 * This card when played forces you to shuffle your entire hand into your deck, then draw the exact same number of cards.
 * Has a cost of 1 draw
 */

import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { ReturnToDeckEffect } from '../effect/ReturnToDeckEffect';
import { cardRegistry } from './CardRegistry';

export class Reload extends Card {
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'reload',
      name: 'Reload',
      description:
        'Return your entire hand to your deck, shuffle, then draw the same number of cards.',
      baseCost: 1,
      currentCost: 1,
      maxCopies: 2,
      ...data,
    });
  }

  execute(engine: GameEngine, targetCardIndexes?: string[]): void {
    const handCards = [...engine.getHand()];
    const handSize = handCards.length;
    const allHandIds = handCards.map((card) => card.uniqueId);

    new ReturnToDeckEffect().resolve(engine, allHandIds);

    // Mint a fresh uniqueId for every returned card. Without this, a card the
    // shuffle happens to redraw into the same hand keeps its old id, so its
    // React key doesn't change and the client's card-entrance animation never
    // replays for it
    handCards.forEach((card) => {
      card.uniqueId = crypto.randomUUID();
    });

    engine.shuffle();
    engine.draw(handSize);
  }
}

cardRegistry.register('reload', Reload);
