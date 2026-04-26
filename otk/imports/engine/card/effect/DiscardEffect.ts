/**
 * @author: Justin La
 * Discard card effect
 */
import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";

export class DiscardEffect implements Effect {

    resolve(engine: GameEngine, targetCardIds?: string[]) {        
        targetCardIds.forEach(id => {
            const card = engine.hand.find(card => card.cardId === id)
            if (card) {
                card.onDiscard();
            }
        })
    }

}

