// CardRegistry.ts

// importing components
import { Card, cardData } from "./Card";

export class CardRegistry {

  private factories: Map<string, () => Card>;

  constructor() {
    this.factories = new Map();
  }

  // add an entry - cardFactory is a function that returns a fresh Card instance
  register(cardId: string, cardFactory: () => Card): void {
    if (this.factories.has(cardId)) {
      throw new Error(`Card already registered: ${cardId}`);
    }
    this.factories.set(cardId, cardFactory);
  }

  // creates a fresh Card instance from saved cardData
  create(data: cardData): Card {
    const factory = this.factories.get(data.cardId);
    if (!factory) {
      throw new Error(`Unknown cardId: ${data.cardId}`);
    }
    const card = factory();
    card.currentCost = data.currentCost;
    if (data.currentAttack !== undefined) card.currentAttack = data.currentAttack;
    return card;
  }

}

export const cardRegistry = new CardRegistry();
