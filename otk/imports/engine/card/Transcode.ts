// Transcode.ts

// importing components
import { Card } from "./Card";
import { GameEngine } from "../GameEngine";
import { ReturnToDeckEffect } from "../effect/ReturnToDeckEffect";

export class Transcode extends Card {

  // constructs card
  constructor(cardId: string) {
    super({
      cardId: "tra",
      name: "Transcode",
      description: "Return 3 card from hand to deck.",
      baseCost: 4,
      currentCost: 4,
      cardAmountToSelect: { min: 3, max: 3 }
    });
  }

  // executes card effects
  execute(engine: GameEngine, targetCardIndexes: string[]): void {
    ReturnToDeckEffect().resolve(engine, targetCardIndexes)
  }

}
