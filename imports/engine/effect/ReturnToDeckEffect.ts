import { GameEngine } from "../GameEngine";
import { Card } from "../card/Card";
import { Effect } from "./Effect";

/**
 * ReturnToDeckEffect returns the selected cards to the deck
 */
export class ReturnToDeckEffect implements Effect {
    resolve(engine: GameEngine, targetCardIndexes?: string[]): void {
        if (!targetCardIndexes) return;       
        // collects all cards that need to be returned first
        const cardsToReturn: Card[] = [];
        targetCardIndexes.forEach(id => {
            const card = engine.hand.find(card => card.cardId === id);
            if (card) {
                cardsToReturn.push(card);
            }
        });

        //move collected cards now to the deck
        cardsToReturn.forEach(card => {
            card.resetStats();
            engine.deck.push(card);
            engine.removeFromHand(card.cardId);
        });
    }
}