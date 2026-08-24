// ShortSword.ts

// Importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { DamageEffect } from '../effect/DamageEffect';
import { cardRegistry } from './CardRegistry';

/**
 * Short Sword Card
 * 
 * 
 * @author Ahmad Abu-Shaqra
 * @version 1.0
 */
export class ShortSword extends Card {
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
      cardId: 'short-sword',
      name: 'Short Sword',
      description: 'Deals 10 damage.',
      baseCost: 1,
      currentCost: 1,
      baseAttack: 10,
      currentAttack: 10,
      ...data,
      maxCopies: 2,
    });
  }

  /**
   * Execution of the Short Sword card effect
   * 
   * @param engine GameEngine executing this function
   * 
   * @see GameEngine
   * @see DamageEffect
   */
  execute(engine: GameEngine): void {
    new DamageEffect(this.currentAttack).resolve(engine);
  }
}

cardRegistry.register('short-sword', ShortSword);
