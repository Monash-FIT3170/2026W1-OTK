// Transcode.ts

// importing components
import { Card } from "./Card";
import type { ReturnToDeckEffect } from "../effect/ReturnToDeckEffect";

export class Transcode extends Card {

  // constructs card
  constructor() {
    super({
      cardId: "", // ??
      name: "Transcode",
      cost: 4,
      effects: [ReturnToDeckEffect(cards)]
      // TODO:
      // unsure how ReturnToDeckEffect would work here,
      // the player needs to be able to select which cards
      // they would like to return to deck first
    });
  }

  // TODO: discards card
  onDiscard(): void {}

  // TODO: resets stats of card
  resetStats(): void {}

}
