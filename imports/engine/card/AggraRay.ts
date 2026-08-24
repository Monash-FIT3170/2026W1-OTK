// AggraRay.ts

// Importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { IncreaseCostEffect } from '../effect/IncreaseCostEffect';
import { DamageEffect } from '../effect/DamageEffect';
import { cardRegistry } from './CardRegistry';

/**
 * Aggra-Ray Card
 * 
 * Effect: Adds 1 cost to all cards in hand
 * 
 * @author Ahmad Abu-Shaqra
 * @version 1.0
 */
export class AggraRay extends Card {
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
      cardId: 'aggra-ray',
      name: 'Aggra-Ray',
      description: 'Adds 1 cost to all cards in hand.',
      baseCost: 1,
      currentCost: 1,
      baseAttack: 25,
      currentAttack: 25,
      ...data,
      maxCopies: 2,
    });
  }

  /**
   * Execution of the AggraRay card effect
   * 
   * @param engine GameEngine executing this function
   * 
   * @see GameEngine
   * @see IncreaseCostEffect
   * @see DamageEffect
   */
  execute(engine: GameEngine): void {
    new IncreaseCostEffect(engine.getHand(), 1).resolve(engine)
    new DamageEffect(this.currentAttack).resolve(engine);
  }
}

cardRegistry.register('aggra-ray', AggraRay);
