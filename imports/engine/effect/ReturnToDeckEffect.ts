import { GameEngine } from "../GameEngine";
import { Card } from "../card/Card";
import { Effect } from "./Effect";

/**
 * ReturnToDeckEffect returns the selected cards to the deck
 */
export class ReturnToDeckEffect implements Effect {
    resolve(engine: GameEngine, targetCardIndexes?: string[]): void {
        if (!targetCardIndexes) return;

        const cardsToReturn: Card[] = [];
        targetCardIndexes.forEach(id => {
            const card = engine.hand.find(card => card.uniqueId === id);
            if (card) {
                cardsToReturn.push(card);
            }
        });

        cardsToReturn.forEach(card => {
            card.resetStats();
            engine.deck.push(card);
            engine.removeFromHand(card.uniqueId);
        });
    }
}
