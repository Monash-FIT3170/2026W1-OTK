/**
 * Set Hand Cost Zero card effect, when a card with this effect is played, all card costs are set to zero
 */
import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";
import { Card } from "../card/Card";

export class SetHandCostZeroEffect implements Effect {

    resolve(engine: GameEngine, targetCardIndexes?: string[]) {
        if (!targetCardIndexes) return;

        engine.hand.forEach((card: Card) => {
            card.currentCost = 0;
        });
    }
}
