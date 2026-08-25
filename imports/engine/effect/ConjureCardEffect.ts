import { GameEngine } from '../GameEngine';
import { Card } from '../card/Card';
import { Effect } from './Effect';
import { cardRegistry } from '../card/CardRegistry';

/**
 * ConjureCardEffect conjures, creates new copies of a specified card,
 * and shuffles them into the deck
 *
 * @author Eric Blyth
 * @version 1.0
 */
export class ConjureCardEffect implements Effect {
  private card: Card;
  private amount: number;

  /**
   * Effect Constructor
   * Uses cardRegistry to create cards based on a passed in card
   *
   * @param card Card to conjure copies of
   * @param amount Amount of copies to conjure, defaults to 1
   *
   * @see Card
   * @see CardRegistry
   */
  constructor(card: Card, amount: number = 1) {
    this.card = card;
    this.amount = amount;
  }

  /**
   * Execution of this effect
   *
   * @param engine GameEngine executing this effect
   * @param targetCardIndexes Targeted indices, unused for this effect
   */
  resolve(engine: GameEngine, targetCardIndexes?: string[]): void {
    for (let index = 0; index < this.amount; index++) {
      let card: Card = cardRegistry.create({
        ...this.card.toJSON(),
        uniqueId: undefined,
      });
      engine.deck.push(card);
    }

    engine.shuffle();
  }
}
