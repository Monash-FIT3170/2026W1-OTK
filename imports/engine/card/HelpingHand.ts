// HelpingHand.ts

// Importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { ChangeCostEffect } from '../effect/ChangeCostEffect';
import { cardRegistry } from './CardRegistry';

/**
 * Helping Hand Card
 *
 * Effect: Decreases cost of selected card by 2
 *
 * @author Ahmad Abu-Shaqra
 * @version 1.0
 */
export class HelpingHand extends Card {
  /**
   * Card constructor
   * Initialises values based on default, can instead pass cardData to restore mutable stats
   *
   * @param data Passed cardData
   *
   * @see cardData
   */
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'helping-hand',
      name: 'Helping Hand',
      description: 'Decreases cost of selected card by 2.',
      baseCost: 1,
      currentCost: 1,
      cardAmountToSelect: {min: 1, max: 1},
      ...data,
      maxCopies: 2,
    });
  }

  /**
   * Execution of the HelpingHand card effect
   *
   * @param engine GameEngine executing this function
   *
   * @see GameEngine
   * @see ChangeCostEffect
   */
  execute(engine: GameEngine, targetCardIndexes?: string[]): void {
    if (!targetCardIndexes) return;

    const cards = targetCardIndexes
      .map((id: string) => engine.hand.find((card) => card.uniqueId === id))
      .filter((card) => card !== undefined);

    new ChangeCostEffect(cards, -2).resolve(engine);
  }
}

cardRegistry.register('helping-hand', HelpingHand);
