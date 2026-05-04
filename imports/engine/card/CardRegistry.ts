// CardRegistry.ts

// importing components
import { Card, cardData } from "./Card";

export class CardRegistry {

  // defining attributes
  public registry: Record<string, cardData> = {};

  // constructs registry
  constructor(initialData: Record<string, cardData> = {}) {
    this.registry = initialData;
  }

  // add an entry
  register(cardId: string, value: cardData): void {
    this.registry[cardId] = value;
  }

  // get an entry
  get(cardId: string): cardData | undefined {
    return this.registry[cardId];
  }

}

export const cardRegistry = new CardRegistry();
