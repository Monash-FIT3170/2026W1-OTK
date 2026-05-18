/**
 * Discard card effect, when a card with this effect is played, discards target cards
 */
import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";
import { Card } from "../card/Card";

export class DiscardEffect implements Effect {

    resolve(engine: GameEngine, targetCardIndexes?: string[]) {
        if (!targetCardIndexes) return;

        const cardsToDiscard: Card[] = [];
        targetCardIndexes.forEach((id: string) => {
            const card = engine.hand.find((card: Card) => card.uniqueId === id);
            if (card) {
                cardsToDiscard.push(card);
            }
        });

        cardsToDiscard.forEach(card => {
            card.onDiscard();
            engine.removeFromHand(card.uniqueId);
        });
    }
}
