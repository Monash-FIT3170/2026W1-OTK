// Card.ts

// importing components
import { GameEngine } from "../GameEngine";

// defining card data types
type cardData = {
  cardId: string;
  name: string;
  baseCost: number;
  currentCost: number;
  baseAttack?: number;
  currentAttack?: number;
  cardAmountToSelect?: { min: number, max: number };
};

export abstract class Card {
  public cardId: string;
  public name: string;
  public baseCost: number;
  public currentCost: number;
  public baseAttack?: number;
  public currentAttack?: number;
  public cardAmountToSelect?: { min: number, max: number };

  // constructs card
  constructor(data: {
    cardId: string;
    name: string;
    baseCost: number;
    currentCost: number;
    baseAttack?: number;
    currentAttack?: number;
    cardAmountToSelect?: { min: number, max: number };
  }) {
    this.cardId = data.cardId;
    this.name = data.name;
    this.baseCost = data.baseCost;
    this.currentCost = data.currentCost;
    this.baseAttack = data.baseAttack;
    this.currentAttack = data.currentAttack;
    this.cardAmountToSelect = data.cardAmountToSelect;
  }

  // executes card effects
  abstract execute(engine: GameEngine, targetCardIds?: string[]): void;

  // runs when card is discarded: does nothing
  onDiscard(): void {}

  // runs when card is returned to deck: resets stats
  resetStats(): void {
    this.currentCost = this.baseCost
    this.currentAttack = this.baseAttack
  }

  // returns card data JSON object
  toJSON(): cardData {
    return {
      cardId: this.cardId,
      name: this.name,
      baseCost: this.baseCost,
      currentCost: this.currentCost,
      baseAttack: this.baseAttack,
      currentAttack: this.currentAttack,
      cardAmountToSelect: this.cardAmountToSelect
    };
  }
}
