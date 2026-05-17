/**
 * Zero Cost effect sets the current cost of the target cards to 0
 */

import { GameEngine } from "../GameEngine";
import { Effect } from "./effect";

export class ZeroEffect implements Effect {
    resolve(engine: GameEngine, targetCardIndexes?: string[]): void {
        if (targetCardIndexes) return;

        targetCardIndexes.forEach((id: string) => {
            const card = engine.hand.find((card) => card.uniqueId === id);
            if (card) {
                card.currentCost = 0;
            }
        });
    }
}

