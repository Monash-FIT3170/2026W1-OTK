/**
 * Card Cost Attack effect multiplies the attack of a card by its cost
 */

import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";

export class CostDamageEffect implements Effect {
    resolve(engine: GameEngine, targetCardIndexes?: string[]): void {
        if (!targetCardIndexes) return;

        targetCardIndexes.forEach((id: string) => {
            const card = engine.hand.find((card) => card.uniqueId === id);
            if (card && card.currentAttack) {
                card.currentAttack = card.currentCost * card.currentAttack;
            }
        });
    }
}

