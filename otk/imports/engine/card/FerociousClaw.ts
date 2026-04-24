// FerociousClaw.ts

// importing components
import { Card } from "./Card";
import { DiscardEffect } from "../effect/DiscardEffect";
import { DamageEffect } from "../effect/DamageEffect";

export class FerociousClaw extends Card {

  // constructs card
  constructor() {
    super({
      cardId: "", // ??
      name: "Ferocious Claw",
      cost: 3,
      baseAttack: 24,
      currentAttack: 24,
      effects: [DiscardEffect(cards), DamageEffect(24)]
      // TODO:
      // unsure how DiscardEffect would work here,
      // the player needs to be able to select which cards
      // they would like to discard first
    });
  }

  // TODO: discards card
  onDiscard(): void {}

  // TODO: resets stats of card
  resetStats(): void {}

}
