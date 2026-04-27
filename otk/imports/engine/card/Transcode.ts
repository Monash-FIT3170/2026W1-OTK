// Transcode.ts

// importing components
import { Card } from "./Card";
import { GameEngine } from "../GameEngine";
import { ReturnToDeckEffect } from "../effect/ReturnToDeckEffect";

export class Transcode extends Card {

  // constructs card
  constructor(cardId: string) {
    super({
      cardId: cardId,
      name: "Transcode",
      baseCost: 4,
      currentCost: 4,
      cardAmountToSelect: { min: 3, max: 3 }
    });
  }

  // executes card effects
  execute(engine: GameEngine, targetCardIds: string[]): void {
    ReturnToDeckEffect().resolve(engine, targetCardIds)
  }

}
