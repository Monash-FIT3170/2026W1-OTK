// GameEngine.ts

// importing components
import { cardData, Card } from './card/Card';
import { enemyData, Enemy } from './enemy/Enemy';
import { cardRegistry, CardRegistry } from './card/CardRegistry';
import { enemyRegistry } from './enemy/EnemyRegistry';

export type GameState = {
  hand: cardData[];
  deck: cardData[];
  enemy: enemyData;
};

export class GameEngine {
  // attributes
  public hand: Card[];
  public deck: Card[];
  public enemy: Enemy;
  public stage: number;

  // constructs game engine from game state
  constructor(gameState: GameState) {
    this.hand = gameState.hand.map((card) => cardRegistry.create(card));

    this.deck = gameState.deck.map((card) => cardRegistry.create(card));

    this.enemy = enemyRegistry.create(gameState.enemy);

    // TODO: unsure what this is referring to
    this.stage = 0;
  }

  // checks if card selected requires other cards to be selected
  drawCost(cardId: string): {
    requiresSelection: boolean;
    cardAmountToSelect?: { min: number; max: number };
  } {
    // gets card
    const card = this.getCard(cardId);

    // card has a card amount to select, returns true with max amount
    if (card.cardAmountToSelect) {
      return {
        requiresSelection: true,
        cardAmountToSelect: card.cardAmountToSelect,
      };
    }

    // card does not have a card amount to select, returns false
    return {
      requiresSelection: false,
    };
  }

  // executes card
  executeCard(cardId: string, selectedCardIds: string[] = []): void {
    // gets card
    const card = this.getCard(cardId);

    // executes card
    card.execute(this, selectedCardIds);

    // removes card from hand
    this.removeFromHand(cardId);
  }

  // ------------------
  //  helper functions
  // ------------------

  getCard(cardId: string): Card {}

  getHand(): Card[] {}

  getDeck(): Card[] {}

  removeFromHand(cardId: string): void {}

  toJSON(): GameState {}
}
