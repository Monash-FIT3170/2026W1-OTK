/**
 * DivideAndConquer.ts
 * Playable card that can convert the cost of a selected card into the same number
 * of Air Knife cards which deal damage individually. The selected card is discarded.
 */

// importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { cardRegistry } from './CardRegistry';
import { CreateEffect } from '../effect/CreateEffect';
import { DiscardEffect } from '../effect/DiscardEffect';
import { AirKnife } from './AirKnife';

export class DivideAndConquer extends Card {
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'divide-and-conquer',
      name: 'Divide and Conquer',
      description: 'Convert each cost of selected card into an Air Knife.',
      baseCost: 0,
      currentCost: 0,
      cardAmountToSelect: { min: 1, max: 1 },
      ...data,
    });
  }

  // executes card effects
  execute(engine: GameEngine, targetCardIndexes?: string[]): void {
    new CreateEffect(new AirKnife() ).resolve(engine, targetCardIndexes);
    new DiscardEffect().resolve(engine, targetCardIndexes);
  }
}

cardRegistry.register('divide-and-conquer', DivideAndConquer);
