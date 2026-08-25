// GameEngine.ts

import { Card } from './card/Card';
import { Enemy } from './enemy/Enemy';
import { cardRegistry } from './card/CardRegistry';
import { enemyRegistry } from './enemy/EnemyRegistry';
import { UserData, EnemyData, BossRecapEntry, RunResult, cardData } from './types';
import { DeckBuilder } from './DeckBuilder';
import { debuffRegistry } from './debuffs';
import { FIRST_STAGE, FINAL_STAGE, getStageConfig } from './stages';

// A gap larger than this since the last server-side action means the player
// closed the tab rather than sat idle - the battle screen heartbeats every 2s
// while it is mounted. See rebaseAfterAway().
const AWAY_THRESHOLD_MS = 6000;

export class GameEngine {
  public baseDeck: Card[];
  public hand: Card[];
  public deck: Card[];
  public enemy: Enemy;
  public stage: number;
  public userId: string;
  public result: RunResult;
  public bossRecap: BossRecapEntry[];
  public stageStartedAt: number;
  public cardsUsedThisStage: number;
  public lastActiveAt: number;

  constructor(userData: UserData) {
    this.userId = userData.userId;
    this.baseDeck =
      userData.baseDeck?.map((card) => cardRegistry.create(card)) ||
      userData.hand.map((card) => cardRegistry.create(card));
    this.hand = userData.hand.map((card) => cardRegistry.create(card));
    this.deck = userData.deck.map((card) => cardRegistry.create(card));
    this.enemy = enemyRegistry.create(userData.enemy);
    this.stage = userData.stage;
    this.result = userData.result;
    this.bossRecap = userData.bossRecap ?? [];
    this.stageStartedAt = userData.stageStartedAt ?? Date.now();
    this.cardsUsedThisStage = userData.cardsUsedThisStage ?? 0;
    this.lastActiveAt = userData.lastActiveAt ?? Date.now();
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

    this.hand.forEach((handCard) => handCard.onOtherCardPlayed(card, this));
    this.deck.forEach((deckCard) => deckCard.onOtherCardPlayed(card, this));

    // 2. ADD THIS LINE: Stop the current timer because the player acted
    this.clearTimerDebuff();

    // 3. This will trigger your Timer.executeDebuff(), which sees the timer
    // is cleared and restarts a fresh 5-second grace period!
    this.executeEnemyDebuffs();

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
  }

  // The current boss just died. Ends the run on the final stage, otherwise
  // parks at the interstitial until the player asks for the next enemy.
  clearStage(): void {
    this.finalizeBossRecap('win');
    this.clearTimerDebuff();
    this.result = this.stage >= FINAL_STAGE ? 'win' : 'stageCleared';
  }

  // Player confirmed "Next Enemy" on the stage-clear screen.
  //
  // The deck is rebuilt from this run's baseDeck and never from the player's
  // saved nextDeck - that is what locks the deck for the duration of a run.
  advanceStage(): void {
    if (this.result !== 'stageCleared') {
      throw new Error('Cannot advance: the current stage is not cleared');
    }

    this.stage += 1;
    const { BossClass } = getStageConfig(this.stage);
    this.enemy = new BossClass();
    this.deck = this.freshDeckFromBase();
    this.hand = [];
    this.result = 'playing';
    this.stageStartedAt = Date.now();
    this.cardsUsedThisStage = 0;

    this.shuffle();
    this.activateEnemyDebuffs();
    this.draw();
  }

  // Fresh copies of the run's locked deck. Cloning through the registry is what
  // keeps cost changes and freezes from one stage leaking into the next -
  // reusing the baseDeck instances directly would carry that mutation across.
  private freshDeckFromBase(): Card[] {
    return this.baseDeck.map((card) => {
      const fresh = cardRegistry.create({
        ...card.toJSON(),
        // Dropping uniqueId makes Card mint a new one, so a reshuffled deck can
        // never collide with a card conjured earlier in the run.
        uniqueId: undefined,
        isFrozen: false,
      });
      fresh.resetStats();
      return fresh;
    });
  }

  // Absolute deadlines must not tick down while the player is away. The battle
  // screen heartbeats every 2s, so a longer gap means the tab was closed: push
  // the clocks forward by exactly that gap. Idling *at* the battle screen keeps
  // heartbeating, so the timer debuff keeps its teeth.
  rebaseAfterAway(now: number = Date.now()): void {
    const away = now - this.lastActiveAt;
    if (away <= AWAY_THRESHOLD_MS) return;

    if (this.enemy.timerDebuffDeadline !== null) {
      this.enemy.timerDebuffDeadline += away;
    }
    this.stageStartedAt += away;
  }

  // Marks the player as present. Every game.* method calls this before saving.
  touch(now: number = Date.now()): void {
    this.lastActiveAt = now;
  }

  executeEnemyDebuffs(): void {
    this.enemy.debuffs.forEach((debuffId) => {
      debuffRegistry.create(debuffId).executeDebuff(this);
    });
  }

  resolveTimerDebuff(now: number = Date.now()): void {
    if (
      !this.enemy.timerDebuffActive ||
      this.enemy.timerDebuffDeadline === null
    ) {
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
    const stage = FIRST_STAGE;
    const { BossClass, scene } = getStageConfig(stage);
    const enemy: EnemyData = new BossClass().toJSON();
    const userData: UserData = {
      userId,
      stage,
      baseDeck,
      deck,
      hand: [],
      enemy,
      scene,
      result: 'playing',
      bossRecap: [],
      stageStartedAt: Date.now(),
      cardsUsedThisStage: 0,
      lastActiveAt: Date.now(),
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
      scene: getStageConfig(this.stage).scene,
      result: this.result,
      bossRecap: this.bossRecap,
      stageStartedAt: this.stageStartedAt,
      cardsUsedThisStage: this.cardsUsedThisStage,
      lastActiveAt: this.lastActiveAt,
    };
  }
}
