import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { cardRegistry } from './CardRegistry';
import { DiscardNonDamageEffect } from '../effect/DiscardNonDamageEffect';
import { SetHandCostZeroEffect } from '../effect/SetHandCostZeroEffect';

export class FinalStand extends Card {
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'final-stand',
      name: 'Final Stand',
      description: 'Discard all non-damage cards, set all card costs to zero',
      baseCost: 0,
      currentCost: 0,
      maxCopies: 1,
      ...data,
    });
  }

  execute(engine: GameEngine, targetCardIndexes?: string[]): void {
    new DiscardNonDamageEffect().resolve(engine, targetCardIndexes);
    new SetHandCostZeroEffect().resolve(engine, targetCardIndexes);
  }
}

cardRegistry.register('final-stand', FinalStand);
