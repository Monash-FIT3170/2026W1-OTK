// FogClearing.ts

// importing components
import { Card } from "./Card";
import { DamageEffect } from "../effect/DamageEffect";

export class FogClearing extends Card {

  // constructs card
  constructor() {
    super({
      cardId: "", // ??
      name: "Fog Clearing",
      cost: 2,
      baseAttack: 12,
      currentAttack: 12,
      effects: [DamageEffect(12)]
    });
  }

  // TODO: discards card
  onDiscard(): void {}

  // TODO: resets stats of card
  resetStats(): void {}

}
