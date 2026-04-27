/**
 * Discard card effect, when a card with this effect is played, discards target cards
 */
import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";

export class DiscardEffect implements Effect {

    resolve(engine: GameEngine, targetCardIds?: string[]) {        
        targetCardIds?.forEach(id => {
            const card = engine.hand.find(card => card.cardId === id)
            if (card) {
                card.onDiscard();
                engine.removeFromHand(id);
            }
        })
    }
}

