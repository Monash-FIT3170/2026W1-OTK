// FerociousClaw.ts

// importing components
import { Card } from "./Card";
import { GameEngine } from "../GameEngine";
import { DiscardEffect } from "../effect/DiscardEffect";
import { DamageEffect } from "../effect/DamageEffect";
import { cardRegistry } from "./CardRegistry";

export class FerociousClaw extends Card {

  // constructs card
  constructor() {
    super({
      cardId: "ferocious-claw",
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
    new DiscardEffect().resolve(engine, targetCardIndexes)
    new DamageEffect(this.currentAttack).resolve(engine)
  }

}

cardRegistry.register("ferocious-claw", new FerociousClaw().toJSON());
