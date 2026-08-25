// GameEngine.ts

import { Card } from './card/Card';
import { Enemy } from './enemy/Enemy';
import { cardRegistry } from './card/CardRegistry';
import { enemyRegistry } from './enemy/EnemyRegistry';
import { UserData } from './types';
import { DeckBuilder } from './DeckBuilder';
import { Goblin } from './enemy/enemies/Goblin';

// factory per stage so each boss can have distinct data despite reusing the Goblin class for now
const BOSS_LOOKUP: { [stage: number]: () => Enemy } = {
  1: () => new Goblin(),
  2: () => new Goblin({ name: 'Goblin II' }),
  3: () => new Goblin({ name: 'Goblin III' }),
};

const SCENE_LOOKUP: { [stage: number]: string } = {
  1: 'underpass-overlaid',
  2: 'underpass-overlaid',
  3: 'underpass-overlaid',
};

const MAX_STAGE = Math.max(...Object.keys(BOSS_LOOKUP).map(Number));

export class GameEngine {
  public hand: Card[];
  public deck: Card[];
  public enemy: Enemy;
  public stage: number;
  public userId: string;
  public result: 'win' | 'loss' | 'playing' | 'stageWin';

  constructor(userData: UserData) {
    this.userId = userData.userId;
    this.hand = userData.hand.map((card) => cardRegistry.create(card));
    this.deck = userData.deck.map((card) => cardRegistry.create(card));
    this.enemy = enemyRegistry.create(userData.enemy);
    this.stage = userData.stage;
    this.result = userData.result;
  }

  // draws cards equal to the card's cost into hand, returns selection info
  drawCost(uniqueId: string): {
    requiresSelection: boolean;
    cardAmountToSelect?: { min: number; max: number };
  } {
    const card = this.getCard(uniqueId);

    this.draw(card.currentCost);

    if (card.cardAmountToSelect) {
      return {
        requiresSelection: true,
        cardAmountToSelect: card.cardAmountToSelect,
      };
    }
    return { requiresSelection: false };
  }

  // removes card from hand and executes its effect
  executeCard(uniqueId: string, selectedCardIds: string[] = []): void {
    const card = this.getCard(uniqueId);
    this.removeFromHand(uniqueId);
    card.execute(this, selectedCardIds);
  }

  isEnemyDefeated(): boolean {
    return this.enemy.currentHealth <= 0;
  }

  isFinalStage(): boolean {
    return this.stage >= MAX_STAGE;
  }

  // starts a fresh hand/deck for the next boss
  advanceStage(): void {
    this.loadStage(this.stage + 1);
    this.result = 'playing';
  }

  hasPlayableCards(): boolean {
    return this.hand.some((card) => card.currentCost <= this.deck.length);
  }

  static newGame(userId: string): UserData {
    const stage = 1;
    const userData: UserData = {
      userId,
      stage,
      deck: DeckBuilder.buildStartingDeck(),
      hand: [],
      enemy: BOSS_LOOKUP[stage]().toJSON(),
      scene: SCENE_LOOKUP[stage],
      result: 'playing',
    };

    const engine = new GameEngine(userData);
    engine.loadStage(stage);
    return engine.toJSON();
  }

  private loadStage(stage: number): void {
    this.stage = stage;
    this.deck = DeckBuilder.buildStartingDeck().map((card) => cardRegistry.create(card));
    this.enemy = enemyRegistry.create(BOSS_LOOKUP[stage]().toJSON());
    this.hand = [];

    this.shuffle();
    this.draw();
  }

  // ------------------
  //  helper functions
  // ------------------
  shuffle(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  draw(n: number = 5): void {
    const drawn = this.deck.splice(0, n);
    this.hand.push(...drawn);
  }

  getCard(uniqueId: string): Card {
    const card = this.hand.find((c) => c.uniqueId === uniqueId);
    if (!card)
      throw new Error(`Card with uniqueId "${uniqueId}" not found in hand`);
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
      result: this.result,
    };
  }
}
