// SelectionHand.ts

// importing components
import { GameEngine } from '../GameEngine';
import { Card, cardData } from './Card';

export class SelectionHand {
  // defining attributes
  public selectedCard: Card;
  public selections: Card[];
  public minSelectAmount?: number;
  public maxSelectAmount?: number;

  // constructs registry
  constructor(card: Card) {
    this.selectedCard = card;
    this.selections = [];
    this.maxSelectAmount = this.selectedCard.cardAmountToSelect?.max;
    this.minSelectAmount = this.selectedCard.cardAmountToSelect?.min;
  }

  // remove an entry
  removeSelection(card: Card): void {
    this.selections = this.selections.filter((x) => x !== card);
  }

  addSelection(card: Card): boolean {
    if (this.selections.length == this.maxSelectAmount) return false;
    this.selections = this.selections.concat(card);
    return true;
  }

  isSelectableAmount(): boolean {
    return (
      this.minSelectAmount !== undefined &&
      this.maxSelectAmount !== undefined &&
      this.selections.length >= this.minSelectAmount &&
      this.selections.length <= this.maxSelectAmount
    );
  }

  activateSelection(gameEngine: GameEngine): void {
    this.selectedCard.execute(
      gameEngine,
      this.selections.map((x) => x.cardId)
    );
  }

  returnAllCards(): Card[] {
    return this.selections.concat(this.selectedCard);
  }
}
