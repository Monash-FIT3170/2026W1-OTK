// CardHand.ts

// importing components
import { Card } from './Card';

export class CardHand {
  // defining attributes
  public cards: Card[];

  // constructs registry
  constructor(initCards: Card[] = []) {
    this.cards = initCards || [];
  }

  // remove an entry
  removeCard(card: Card): void {
    this.cards = this.cards.filter((x) => x !== card);
  }

  addCard(card: Card): void {
    this.cards = this.cards.concat(card);
  }

  returnAllCards(): Card[] {
    console.log('value of this.cards:', this.cards)
    return [...this.cards];
  }
}

export const cardHand = new CardHand([]);
