import { Card, cardData} from "./Card";
import { GameEngine } from "../GameEngine";
import { ZeroEffect } from "../effect/ZeroEffect";
import { cardRegistry } from "./CardRegistry";

export class TeaCeremony extends Card {
    constructor(data?: Partial<cardData>) {
        super({
            cardId: 'tea-ceremony',
            name: 'tea ceremony+',
            description: 'Turn two cards in hand to 0.',
            baseCost: 1,
            currentCost: 1,
            cardAmountToSelect: {min: 2, max: 2},
            ...data,
        });
    }


    execute(engine: GameEngine, targetCardIndexes?: string[]): void {
        new ZeroEffect().resolve(engine, targetCardIndexes);
    }
}
    
cardRegistry.register('tea-ceremony', TeaCeremony);
