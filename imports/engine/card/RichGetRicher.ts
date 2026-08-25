import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { CostDamageEffect } from '../effect/CostDamageEffect';
import { cardRegistry } from './CardRegistry';

export class RichGetRicher extends Card {
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'rich-get-richer',
      name: 'Rich Get Richer',
      description: "Multiplies a card's damage by its cost",
      baseCost: 3,
      currentCost: 3,
      cardAmountToSelect: { min: 1, max: 1 },
      maxCopies: 1,
      ...data,
    });
  }

  execute(engine: GameEngine, targetCardIndexes?: string[]): void {
    new CostDamageEffect().resolve(engine, targetCardIndexes);
  }
}

cardRegistry.register('rich-get-richer', RichGetRicher);
