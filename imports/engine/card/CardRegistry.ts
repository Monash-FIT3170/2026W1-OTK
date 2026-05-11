// CardRegistry.ts

// importing components
import { Card, cardData } from './Card';

export class CardRegistry {
  // stores the card class constructor per cardId
  private registry: Map<string, new (data?: Partial<cardData>) => Card>;

  constructor() {
    this.registry = new Map();
  }

  // add an entry - CardClass is the card's class constructor
  register(cardId: string, CardClass: new (data?: Partial<cardData>) => Card): void {
    if (this.registry.has(cardId)) {
      throw new Error(`Card already registered: ${cardId}`);
    }
    this.registry.set(cardId, CardClass);
  }

  // constructs a card instance from saved cardData
  create(data: cardData): Card {
    const CardClass = this.registry.get(data.cardId);
    if (!CardClass) {
      throw new Error(`Unknown cardId: ${data.cardId}`);
    }
    return new CardClass(data);
  }
}

export const cardRegistry = new CardRegistry();
