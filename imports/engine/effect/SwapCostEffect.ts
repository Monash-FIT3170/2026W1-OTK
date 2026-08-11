/**
 * Swap Cost effect adds the cost of the first card to the second card
 */

import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";

export class SwapCostEffect implements Effect {
    resolve(engine: GameEngine, targetCardIndexes?: string[]): void {
        if (!targetCardIndexes) return;
        if (targetCardIndexes.length != 2) return;

        const card1 = engine.hand.find((card) => card.uniqueId === targetCardIndexes[0]);
        const card2 = engine.hand.find((card) => card.uniqueId === targetCardIndexes[1]);

        if (card1 && card2){
            card2.currentCost += card1.currentCost;
            card1.currentCost = 0;
        }
    }
}

