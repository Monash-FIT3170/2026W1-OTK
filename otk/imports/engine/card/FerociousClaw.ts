// FerociousClaw.ts

// importing components
import { Card } from "./Card";
import { GameEngine } from "../GameEngine";
import { DiscardEffect } from "../effect/DiscardEffect";
import { DamageEffect } from "../effect/DamageEffect";

export class FerociousClaw extends Card {

  // constructs card
  constructor() {
    super({
      cardId: "fer",
      name: "Ferocious Claw",
      description: "Discard 1 card from hand.",
      baseCost: 3,
      currentCost: 3,
      baseAttack: 24,
      currentAttack: 24,
      cardAmountToSelect: { min: 1, max: 1 }
    });
  }

  // executes card effects
  execute(engine: GameEngine, targetCardIndexes: string[]): void {
    DiscardEffect().resolve(engine, targetCardIndexes)
    DamageEffect(this.currentAttack).resolve(engine)
  }

}
