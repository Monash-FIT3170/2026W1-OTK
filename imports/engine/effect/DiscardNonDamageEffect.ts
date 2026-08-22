/**
 * Discard Non Damage card effect, when a card with this effect is played, all non damage cards in hand are discarded
 */
import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";
import { Card } from "../card/Card";

export class DiscardNonDamageEffect implements Effect {

    resolve(engine: GameEngine, targetCardIndexes?: string[]) {
        if (!targetCardIndexes) return;

        const cardsToDiscard: Card[] = [];
        engine.hand.forEach((card: Card) => {
            if (card.baseAttack == undefined) {
                cardsToDiscard.push(card);
            }
        });

        cardsToDiscard.forEach(card => {
            card.onDiscard();
            engine.removeFromHand(card.uniqueId);
        });
    }
}
