import { Card, cardData} from "./Card";
import { GameEngine } from "../GameEngine";
import { cardRegistry } from "./CardRegistry";
import { SwapCostEffect } from "../effect/SwapCostEffect";

export class TaxThePoor extends Card {
    constructor(data?: Partial<cardData>) {
        super({
            cardId: 'tax-the-poor',
            name: 'Tax the Poor',
            description: "adds the cost of the first card to the cost of the second card",
            baseCost: 0,
            currentCost: 0,
            cardAmountToSelect: {min: 2, max: 2},
            ...data,
        });
    }


    execute(engine: GameEngine, targetCardIndexes?: string[]): void {
        new SwapCostEffect().resolve(engine, targetCardIndexes);
    }
}
    
cardRegistry.register('tax-the-poor', TaxThePoor);
