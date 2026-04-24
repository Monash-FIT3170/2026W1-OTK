// Card.ts

// importing components
import { GameEngine } from "../GameEngine";
import { Effect } from "../effect/Effect";

// defining card data types
type cardData = {
  cardId: string;
  name: string;
  cost: number;
  baseAttack?: number;
  currentAttack?: number;
  effects: Effect[];
};

export abstract class Card {
  public cardId: string;
  public name: string;
  public cost: number;
  public baseAttack?: number;
  public currentAttack?: number;
  public effects: Effect[];

  // constructs card
  constructor(data: {
    cardId: string;
    name: string;
    cost: number;
    baseAttack?: number;
    currentAttack?: number;
    effects?: Effect[];
  }) {
    this.cardId = data.cardId;
    this.name = data.name;
    this.cost = data.cost;
    this.baseAttack = data.baseAttack;
    this.currentAttack = data.currentAttack;
    this.effects = data.effects ?? [];
  }

  // cycle through all effects
  execute(engine: GameEngine, targetCardIds?: string[]): void {
    for (const effect of this.effects) {
        effect.resolve(engine, targetCardIds);
    }
  }

  // discards card
  abstract onDiscard(): void;

  // resets stats of card
  abstract resetStats(): void;

  // returns card data JSON object
  toJSON(): cardData {
    return {
      cardId: this.cardId,
      name: this.name,
      cost: this.cost,
      baseAttack: this.baseAttack,
      currentAttack: this.currentAttack,
      effects: this.effects,
    };
  }
}
