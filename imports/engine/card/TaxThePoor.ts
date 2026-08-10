import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { cardRegistry } from './CardRegistry';
import { SwapCostEffect } from '../effect/SwapCostEffect';

export class TaxThePoor extends Card {
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'tax-the-poor',
      name: 'Tax the Poor',
      description: 'Adds first card cost to second card',
      baseCost: 1,
      currentCost: 1,
      cardAmountToSelect: { min: 2, max: 2 },
      ...data,
    });
  }

  execute(engine: GameEngine, targetCardIndexes?: string[]): void {
    new SwapCostEffect().resolve(engine, targetCardIndexes);
  }
}

cardRegistry.register('tax-the-poor', TaxThePoor);
