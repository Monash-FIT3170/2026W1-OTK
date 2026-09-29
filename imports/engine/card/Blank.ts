// Blank.ts

// Importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { cardRegistry } from './CardRegistry';

/**
 * Blank Card
 * 
 * Effect: No effect
 * 
 * @author Eric Blyth
 * @version 1.0
 */
export class Blank extends Card {
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
      cardId: 'blank',
      name: 'Blank',
      description: 'Does nothing.',
      baseCost: 0,
      currentCost: 0,
      maxCopies: 2,
      ...data,
    });
  }

  /**
   * Execution of the Blank card effect
   * 
   * @param engine GameEngine executing this function
   * 
   * @see GameEngine
   */
  execute(engine: GameEngine): void {}
}

cardRegistry.register('blank', Blank);
