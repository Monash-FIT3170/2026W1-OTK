// GameEngine.ts

// importing components
import { cardData, Card } from './card/Card';
import { Enemy } from './enemy/Enemy';
import { cardRegistry } from './card/CardRegistry';
import { enemyRegistry } from './enemy/index';
import { UserData, HandCardData, EnemyData } from './types';

export class GameEngine {
  // attributes
  public hand: Card[];
  public deck: Card[];
  public enemy: Enemy;
  public stage: number;

  // constructs game engine from the three separate data sources
  constructor(userData: UserData, handCards: HandCardData[], enemy: EnemyData) {
    this.hand = handCards.map((card) => cardRegistry.create(card));
    this.deck = userData.deck.map((card) => cardRegistry.create(card));
    this.enemy = enemyRegistry.create(enemy);
    this.stage = userData.stage;
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

  // TODO: return data so server methods can save each collection
  toJSON(): { userData: UserData; hand: HandCardData[]; enemy: EnemyData } {}
}
