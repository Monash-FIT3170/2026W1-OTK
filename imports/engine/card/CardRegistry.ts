// CardRegistry.ts

// importing components
import { Card, cardData } from "./Card";

export class CardRegistry {

  // defining attributes
  public registry: Map<string, Card>;

  // constructs registry
  constructor() {
    this.registry = new Map()
  }

  // add an entry
  register(cardId: string, cardObject: Card): void {
    if (this.registry.has(cardId)) {
      throw new Error(`Card already registered: ${cardId}`);
    }
    this.registry.set(cardId, cardObject);
  }

  // get an entry
  get(cardId: string): Card {
    const cardObject = this.registry.get(cardId);
    if (!cardObject) {
      throw new Error(`Unknown cardId: ${cardId}`);
    }
    return cardObject;
  }

}

export const cardRegistry = new CardRegistry();
