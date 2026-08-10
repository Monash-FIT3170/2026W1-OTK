import { GameEngine } from '../GameEngine';
import { Card } from '../card/Card';
import { Effect } from './Effect';

/**
 * CreateEffect creates new cards based on the selected cards
 */
export class CreateEffect implements Effect {
    private cardToCreate: Card;
    private numberOfCards: number;

    constructor (cardToCreate: Card) {
        this.cardToCreate = cardToCreate;
        this.numberOfCards = 0;
    }

    resolve(engine: GameEngine, targetCardIndexes?: string[]): void {
        if (!targetCardIndexes) return;
        targetCardIndexes.forEach((id: string) => {
            const card = engine.hand.find((card: Card) => card.uniqueId === id);
            if (card) {
                this.numberOfCards = card.currentCost;
                
            }
        });
        for (let i = 0; i < this.numberOfCards; i++) {
            engine.addToHand(this.cardToCreate);
        }
  }
}
