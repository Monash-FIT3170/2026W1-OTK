import { Card, cardData} from "./Card";
import { GameEngine } from "../GameEngine";
import { CostDamageEffect } from "../effect/CostDamageEffect";
import { cardRegistry } from "./CardRegistry";

export class TaxThePoor extends Card {
    constructor(data?: Partial<cardData>) {
        super({
            cardId: 'tax-the-poor',
            name: 'Tax the Poor',
            description: "adds the cost of the first card to the cost of the second card",
            baseCost: 1,
            currentCost: 1,
            cardAmountToSelect: {min: 2, max: 2},
            ...data,
        });
    }


    execute(engine: GameEngine, targetCardIndexes?: string[]): void {
        new CostDamageEffect().resolve(engine, targetCardIndexes);
    }
}
    
cardRegistry.register('tax-the-poor', TaxThePoor);
