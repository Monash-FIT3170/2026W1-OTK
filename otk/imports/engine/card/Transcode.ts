// Transcode.ts

// importing components
import { Card } from "./Card";
import { GameEngine } from "../GameEngine";
import { ReturnToDeckEffect } from "../effect/ReturnToDeckEffect";
import { cardRegistry } from "./CardRegistry";

export class Transcode extends Card {

  // constructs card
  constructor() {
    super({
      cardId: "transcode",
      name: "Transcode",
      description: "Return 3 card from hand to deck.",
      baseCost: 4,
      currentCost: 4,
      cardAmountToSelect: { min: 3, max: 3 }
    });
  }

  // executes card effects
  execute(engine: GameEngine, targetCardIndexes: string[]): void {
    new ReturnToDeckEffect().resolve(engine, targetCardIndexes)
  }

}

cardRegistry.register("transcode", new Transcode().toJSON());
