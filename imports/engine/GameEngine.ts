// GameEngine.ts

import { Card } from './card/Card';
import { Enemy } from './enemy/Enemy';
import { cardRegistry } from './card/CardRegistry';
import { enemyRegistry } from './enemy/EnemyRegistry';
import { UserData, EnemyData, BossRecapEntry, cardData } from './types';
import { DeckBuilder } from './DeckBuilder';
import { debuffRegistry } from './debuffs';
import { Goblin } from './enemy/enemies/Goblin';
import { IceCube } from './enemy/enemies/IceCube';

const BOSS_LOOKUP: { [stage: number]: new (data?: any) => Enemy } = {
  1: Goblin,
};

const SCENE_LOOKUP: { [stage: number]: string } = {
  1: 'underpass-overlaid',
};

export class GameEngine {
  public baseDeck: Card[];
  public hand: Card[];
  public deck: Card[];
  public enemy: Enemy;
  public stage: number;
  public userId: string;
  public result: 'win' | 'loss' | 'playing';
  public bossRecap: BossRecapEntry[];
  public stageStartedAt: number;
  public cardsUsedThisStage: number;

  constructor(userData: UserData) {
    this.userId = userData.userId;
    this.baseDeck = userData.baseDeck?.map((card) => cardRegistry.create(card)) || userData.hand.map((card) => cardRegistry.create(card));
    this.hand = userData.hand.map((card) => cardRegistry.create(card));
    this.deck = userData.deck.map((card) => cardRegistry.create(card));
    this.enemy = enemyRegistry.create(userData.enemy);
    this.stage = userData.stage;
    this.result = userData.result;
    this.bossRecap = userData.bossRecap ?? [];
    this.stageStartedAt = userData.stageStartedAt ?? Date.now();
    this.cardsUsedThisStage = userData.cardsUsedThisStage ?? 0;
  }

  // draws cards equal to the card's cost into hand, returns selection info
  drawCost(uniqueId: string): {
    requiresSelection: boolean;
    cardAmountToSelect?: { min: number; max: number };
  } {
    this.resolveTimerDebuff();

    const card = this.getCard(uniqueId);
    if (!card.isPlayable()) {
      throw new Error(`Card with uniqueId "${uniqueId}" is frozen`);
    }

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
    // 1. Catches up the math in case the player took too long
    this.resolveTimerDebuff();

    const card = this.getCard(uniqueId);
    if (!card.isPlayable()) {
      throw new Error(`Card with uniqueId "${uniqueId}" is frozen`);
    }
    this.removeFromHand(uniqueId);
    card.execute(this, selectedCardIds);
    this.cardsUsedThisStage += 1;
  }

  // finalizes a recap entry for the current boss and appends it to bossRecap
  finalizeBossRecap(bossResult: 'win' | 'loss'): void {
    this.bossRecap.push({
      bossName: this.enemy.name,
      stage: this.stage,
      timeMs: Date.now() - this.stageStartedAt,
      cardsUsed: this.cardsUsedThisStage,
      result: bossResult,
    });
    
    this.hand.forEach(handCard => handCard.onOtherCardPlayed(card, this));
    this.deck.forEach(deckCard => deckCard.onOtherCardPlayed(card, this));
    
    // 2. ADD THIS LINE: Stop the current timer because the player acted
    this.clearTimerDebuff(); 
    
    // 3. This will trigger your Timer.executeDebuff(), which sees the timer 
    // is cleared and restarts a fresh 5-second grace period!
    this.executeEnemyDebuffs();
  }

  executeEnemyDebuffs(): void {
    this.enemy.debuffs.forEach((debuffId) => {
      debuffRegistry.create(debuffId).executeDebuff(this);
    });
  }

  resolveTimerDebuff(now: number = Date.now()): void {
    if (!this.enemy.timerDebuffActive || this.enemy.timerDebuffDeadline === null) {
      return;
    }

    let deadline = this.enemy.timerDebuffDeadline;
    const interval = this.enemy.timerDebuffInterval;
    const tickAmount = this.enemy.timerDebuffTickAmount;
    let ticked = false;

    if (now >= deadline) {
      const previousHealth = this.enemy.currentHealth;
      this.enemy.currentHealth = Math.min(
        this.enemy.health,
        this.enemy.currentHealth + tickAmount
      );
      this.clearTimerDebuff();
      ticked = true;
    }
  }

  clearTimerDebuff(): void {
    this.enemy.timerDebuffActive = false;
    this.enemy.timerDebuffDeadline = null;

    
  }

  isEnemyDefeated(): boolean {
    return this.enemy.currentHealth <= 0;
  }

  hasPlayableCards(): boolean {
    return this.hand.some(
      (card) => card.isPlayable() && card.currentCost <= this.deck.length
    );
  }

  static newGame(userId: string, deck?: cardData[] | null): UserData {
    deck ??= DeckBuilder.buildStartingDeck(); // No deck provided, use the default starting deck
    const baseDeck = [...deck];
    const stage = 1;
    const BossClass = BOSS_LOOKUP[stage];
    const enemy: EnemyData = new BossClass().toJSON();
    const scene = SCENE_LOOKUP[stage]
    const userData: UserData = {
      userId, stage, deck, hand: [], enemy, scene, result: 'playing',
      bossRecap: [],
      stageStartedAt: Date.now(),
      cardsUsedThisStage: 0,
    const boss = new BossClass();
    const enemy: EnemyData = boss.toJSON();
    const scene = SCENE_LOOKUP[stage];
    const userData: UserData = {
      userId,
      stage,
      baseDeck,
      deck,
      hand: [],
      enemy,
      scene,
      result: 'playing',
    };

    const engine = new GameEngine(userData);
    engine.shuffle();
    engine.activateEnemyDebuffs();
    engine.draw();
    return engine.toJSON();
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

  // Activates debuffs on the player from the debuff registry.
  activateEnemyDebuffs(): void {
    this.enemy.debuffs.forEach((debuffId) => {
      debuffRegistry.create(debuffId).activateDebuff(this);
    });
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

  addToHand(card: Card): void {
    this.hand.push(card);
  }

  toJSON(): UserData {
    return {
      userId: this.userId,
      stage: this.stage,
      baseDeck: this.baseDeck.map((card) => card.toJSON()),
      deck: this.deck.map((card) => card.toJSON()),
      hand: this.hand.map((card) => card.toJSON()),
      enemy: this.enemy.toJSON(),
      scene: SCENE_LOOKUP[this.stage],
      result: this.result,
      bossRecap: this.bossRecap,
      stageStartedAt: this.stageStartedAt,
      cardsUsedThisStage: this.cardsUsedThisStage,
    };
  }
}
