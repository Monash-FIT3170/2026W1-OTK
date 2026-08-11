/**
 * NowYouSeeMe.ts
 * Playable card that can return a selected to the deck. The card may either
 * disappear, or can return with higher damage stats and lower cost.
 */

// importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { DiscardBuffEffect } from '../effect/DiscardBuffEffect';
import { cardRegistry } from './CardRegistry';

export class NowYouSeeMe extends Card {
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'now-you-see-me',
      name: 'Now You See Me',
      description:
        'Returns a card to the deck. It might disappear, or something else?',
      baseCost: 0,
      currentCost: 0,
      cardAmountToSelect: { min: 1, max: 1 },
      ...data,
    });
  }

  execute(engine: GameEngine, targetCardIndexes?: string[]): void {
    new DiscardBuffEffect().resolve(engine, targetCardIndexes);
  }
}

cardRegistry.register('now-you-see-me', NowYouSeeMe);
