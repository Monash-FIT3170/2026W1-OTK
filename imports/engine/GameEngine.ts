// GameEngine.ts

import { Card } from './card/Card';
import { Enemy } from './enemy/Enemy';
import { cardRegistry } from './card/CardRegistry';
import { enemyRegistry } from './enemy/EnemyRegistry';
import { UserData, EnemyData } from './types';
import { DeckBuilder } from './DeckBuilder';
import { Goblin } from './enemy/enemies/Goblin';

const BOSS_LOOKUP: { [stage: number]: new (data?: any) => Enemy } = {
  1: Goblin,
};

const SCENE_LOOKUP: { [stage: number]: string } = {
  1: 'underpass',
};

export class GameEngine {
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
    const card = this.getCard(uniqueId);
    if (card.cardAmountToSelect) {
      return { requiresSelection: true, cardAmountToSelect: card.cardAmountToSelect };
    }
    return { requiresSelection: false };
  }

  // executes card: runs its effects, removes it from hand, then draws cost cards from deck
  executeCard(uniqueId: string, selectedCardIds: string[] = []): void {
    const card = this.getCard(uniqueId);
    const drawCount = card.currentCost;

    card.execute(this, selectedCardIds);
    this.removeFromHand(uniqueId);

    const drawn = this.deck.splice(0, drawCount);
    this.hand.push(...drawn);
  }

  isEnemyDefeated(): boolean {
    return this.enemy.currentHealth <= 0;
  }

  hasPlayableCards(): boolean {
    return this.hand.length > 0;
  }

  static newGame(userId: string): UserData {
    const deck = DeckBuilder.buildStartingDeck();
    const stage = 1;
    const BossClass = BOSS_LOOKUP[stage];
    const enemy: EnemyData = new BossClass().toJSON();
    const scene = SCENE_LOOKUP[stage]
    const userData: UserData = { userId, stage, deck, hand: [], enemy, scene };

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

  toJSON(): UserData {
    return {
      userId: this.userId,
      stage: this.stage,
      deck: this.deck.map((card) => card.toJSON()),
      hand: this.hand.map((card) => card.toJSON()),
      enemy: this.enemy.toJSON(),
      scene: SCENE_LOOKUP[this.stage],
    };
  }
}
