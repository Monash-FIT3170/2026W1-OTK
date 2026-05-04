// FogClearing.ts

// importing components
import { Card } from "./Card";
import { GameEngine } from "../GameEngine";
import { DamageEffect } from "../effect/DamageEffect";
import { cardRegistry } from "./CardRegistry";

export class FogClearing extends Card {

  // constructs card
  constructor() {
    super({
      cardId: "fog",
      name: "Fog Clearing",
      description: "",
      baseCost: 2,
      currentCost: 2,
      baseAttack: 12,
      currentAttack: 12
    });
  }

  // executes card effects
  execute(engine: GameEngine): void {
    new DamageEffect(this.currentAttack).resolve(engine)
  }

}

cardRegistry.register("fog", new FogClearing().toJSON());
