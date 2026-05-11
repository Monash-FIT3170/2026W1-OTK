// GameEngine.ts

// importing components
import { Card } from './card/Card';
import { Enemy } from './enemy/Enemy';
import { cardRegistry } from './card/CardRegistry';
import { enemyRegistry } from './enemy/EnemyRegistry';
import { UserData, EnemyData } from './types';
import { DeckBuilder } from './DeckBuilder';
import { Goblin } from './enemy/enemies/Goblin';

const BOSS_LOOKUP: { [stage: number]: new () => Enemy } = {
  1: Goblin,
};
export class GameEngine {
  // attributes
  public hand: Card[];
  public deck: Card[];
  public enemy: Enemy;
  public stage: number;
  public userId: string;

  constructor(userData: UserData) {
    this.userId = userData.userId;
    this.hand = userData.hand.map((card) => cardRegistry.create(card));
    this.deck = userData.deck.map((card) => cardRegistry.create(card));
    this.enemy = enemyRegistry.create(userData.enemy);
    this.stage = userData.stage;
  }

  // checks if card selected requires other cards to be selected
  drawCost(uniqueId: string): {
    requiresSelection: boolean;
    cardAmountToSelect?: { min: number; max: number };
  } {
    // gets card
    const card = this.getCard(uniqueId);

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
  executeCard(uniqueId: string, selectedCardIds: string[] = []): void {
    // gets card by its unique id
    const card = this.getCard(uniqueId);

    // executes card
    card.execute(this, selectedCardIds);

    // removes card from hand
    this.removeFromHand(uniqueId);
  }

  static newGame(userId: string): UserData {
    const deck = DeckBuilder.buildStartingDeck();
    const stage = 1;
    const BossClass = BOSS_LOOKUP[stage];
    const enemy: EnemyData = new BossClass().toJSON();
    const userData: UserData = { userId, stage, deck, hand: [], enemy };

    const engine = new GameEngine(userData);
    engine.initialDraw();
    return engine.toJSON();
  }

  // ------------------
  //  helper functions
  // ------------------
  initialDraw(n: number = 5): void {
    const drawn = this.deck.splice(0, n);
    this.hand.push(...drawn);
  }

  getCard(uniqueId: string): Card {
    const card = this.hand.find((c) => c.uniqueId === uniqueId);
    if (!card) throw new Error(`Card with uniqueId "${uniqueId}" not found in hand`);
    return card;
  }

  getHand(): Card[] {
    return this.hand;
  }

  getDeck(): Card[] {
    return this.deck;
  }

  removeFromHand(uniqueId: string): void {
    const index = this.hand.findIndex((c) => c.uniqueId === uniqueId);
    if (index !== -1) {
      this.hand.splice(index, 1);
    }
  }

  // TODO: return data so server methods can save each collection
  toJSON(): UserData {
    return {
      userId: this.userId,
      stage: this.stage,
      deck: this.deck.map((card) => card.toJSON()),
      hand: this.hand.map((card) => card.toJSON()),
      enemy: this.enemy.toJSON(),
    };
  }
}
