// CardHand.ts

// importing components
import { Card, cardData } from './Card';

export class CardHand {
  // defining attributes
  public cards: Record<string, cardData> = {};

  // constructs registry
  constructor(initialData: Record<string, cardData> = {}) {
    this.cards = initialData;
  }

  // add an entry
  register(cardId: string, value: cardData): void {
    this.cards[cardId] = value;
  }

  // get an entry
  get(cardId: string): cardData | undefined {
    return this.cards[cardId];
  }

  // remove an entry
  remove(cardId: string): void {
    delete this.cards[cardId];
  }
}

export const cardHand = new CardHand();
