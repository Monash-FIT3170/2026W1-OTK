import { GameEngine } from '../GameEngine';
import { Card } from '../card/Card';
import { Effect } from './Effect';

/**
 * ChangeCostEffect increases the cost of one or more cards
 * 
 * @author Ahmad Abu-Shaqra
 * @version 1.0
 */
export class ChangeCostEffect implements Effect {
  private cards: Card[];
  private amount: number;

  /**
   * Effect Constructor
   * Uses cardRegistry to create cards based on a passed in card
   * 
   * @param cards Cards that will have their cost increased
   * @param amount The value the card costs will be increased by
   * 
   * @see Card[]
   * @see number
   */
  constructor(cards: Card[], amount: number) {
    this.cards = cards;
    this.amount = amount;
  }

  /**
   * Execution of this effect
   * 
   * @param engine GameEngine, unused for this effect
   * @param targetCardIndexes Targeted indices, unused for this effect
   */
  resolve(engine: GameEngine, targetCardIndexes?: string[]): void {
    for (const card of this.cards) {
        card.currentCost = Math.max(0, card.currentCost + this.amount);
    }
  }
}
