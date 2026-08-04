// MistConjuring.ts

// Importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { FogClearing } from './FogClearing';
import { ConjureCardEffect } from '../effect/ConjureCardEffect';
import { cardRegistry } from './CardRegistry';

/**
 * Mist Conjuring Card
 * 
 * Effect: Conjures 3 copies of "Fog Clearing" into the deck and then shuffles it
 * 
 * @author Eric Blyth
 * @version 1.0
 */
export class MistConjuring extends Card {
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
      cardId: 'mist-conjuring',
      name: 'Mist Conjuring',
      description: 'Create 3 copies of "Fog Clearing".',
      baseCost: 3,
      currentCost: 3,
      ...data,
    });
  }

  /**
   * Execution of the MistConjuring card effect
   * 
   * @param engine GameEngine executing this function
   * 
   * @see GameEngine
   * @see ConjureCardEffect
   */
  execute(engine: GameEngine): void {
    const card: Card = new FogClearing();
    const amount = 3;

    new ConjureCardEffect(card, amount).resolve(engine);
  }
}

cardRegistry.register('mist-conjuring', MistConjuring);
