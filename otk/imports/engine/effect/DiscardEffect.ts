/**
 * Discard card effect, when a card with this effect is played, discards target cards
 */
import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";
import { Card } from "../card/Card";

export class DiscardEffect implements Effect {

    resolve(engine: GameEngine, targetCardIds?: string[]) {        
        if (!targetCardIndexes) return;
 
        // collect the matching card instances
        const cardsToDiscard: Card[] = [];
        targetCardIndexes.forEach(id => {
            // look up the card in the current hand by its cardId
            const card = engine.hand.find(card => card.cardId === id);
            // check if card exists in hand
            if (card) {
                cardsToDiscard.push(card);
            }
        });
 
        // now discard each collected card
        cardsToDiscard.forEach(card => {
            card.onDiscard();
            engine.removeFromHand(card.cardId);
        });
    }
}

