// FerociousClaw.ts

// importing components
import { Card } from "./Card";
import { GameEngine } from "../GameEngine";
import { DiscardEffect } from "../effect/DiscardEffect";
import { DamageEffect } from "../effect/DamageEffect";

export class FerociousClaw extends Card {

  // constructs card
  constructor(cardId: string) {
    super({
      cardId: cardId,
      name: "Ferocious Claw",
      baseCost: 3,
      currentCost: 3,
      baseAttack: 24,
      currentAttack: 24,
      cardAmountToSelect: { min: 1, max: 1 }
    });
  }

  // executes card effects
  execute(engine: GameEngine, targetCardIds: string[]): void {
    DiscardEffect().resolve(engine, targetCardIds)
    DamageEffect(this.currentAttack).resolve(engine)
  }

}
