// GameEngine.ts

import { Card } from './card/Card';
import { Enemy } from './enemy/Enemy';
import { cardRegistry } from './card/CardRegistry';
import './card/registerAllCards';
import './powerups/RestartStagePowerup';
import { enemyRegistry } from './enemy/EnemyRegistry';
import { UserData, EnemyData, BossRecapEntry, RunResult, SeenDialogue, cardData, powerUpData, Difficulty } from './types';
import { DeckBuilder } from './DeckBuilder';
import { debuffRegistry } from './debuffs';
import { FIRST_STAGE, SECRET_BOSS_STAGE, getStageConfig, getFinalStageFromDifficulty, shouldShowDialogue, dialogueKey } from './stages';
import { pickRandomPowerUps, PowerUp } from './powerups';
import { powerUpRegistry, powerupRegistry } from './powerups/PowerupRegistry';

// A gap larger than this since the last server-side action means the player
// closed the tab rather than sat idle - the battle screen heartbeats every 2s
// while it is mounted. See rebaseAfterAway().
const AWAY_THRESHOLD_MS = 6000;

export class GameEngine {
  public baseDeck: Card[];
  public hand: Card[];
  public deck: Card[];
  public enemy: Enemy;
  public difficulty: Difficulty;
  public stage: number;
  public userId: string;
  public result: RunResult;
  public bossRecap: BossRecapEntry[];
  public stageStartedAt: number;
  public cardsUsedThisStage: number;
  public powerUpsUsedThisStage: number;
  public debuffsFaced: string[];
  public lastActiveAt: number;
  public powerUps: PowerUp[];
  public powerUpChoices: string[];
  // Pre-battle dialogue for the current stage is finished (or not needed).
  // While false on a 'playing' run the fight has not started - see
  // isIntroPending().
  public dialogueSeen: boolean;
  // Post-battle dialogue for the current stage is finished (or not needed).
  public outroSeen: boolean;
  public endingSeen: boolean;
  public secretEndingSeen: boolean;
  public selectedPowerUps: string[];

  constructor(userData: UserData) {
    this.userId = userData.userId;
    this.baseDeck =
      userData.baseDeck?.map((card) => cardRegistry.create(card)) ||
      userData.hand.map((card) => cardRegistry.create(card));
    this.hand = userData.hand.map((card) => cardRegistry.create(card));
    this.deck = userData.deck.map((card) => cardRegistry.create(card));
    this.enemy = enemyRegistry.create(userData.enemy);
    this.difficulty = userData.difficulty ?? 'easy';
    this.stage = userData.stage;
    this.result = userData.result;
    this.bossRecap = userData.bossRecap ?? [];
    this.stageStartedAt = userData.stageStartedAt ?? Date.now();
    this.cardsUsedThisStage = userData.cardsUsedThisStage ?? 0;
    this.powerUpsUsedThisStage = userData.powerUpsUsedThisStage ?? 0;
    this.debuffsFaced = userData.debuffsFaced ?? [],
    this.lastActiveAt = userData.lastActiveAt ?? Date.now();
    const powerUpList = userData.powerUps ?? []
    // Only `available` is run state - name, description, icon and consumedOnUse
    // come from the power-up class, so balance changes reach existing saves.
    this.powerUps = powerUpList.map(({ powerUpId, available }) => {
      const powerUp = powerUpRegistry.create(powerUpId);
      powerUp.available = available ?? true;
      return powerUp;
    });
    this.powerUpChoices = userData.powerUpChoices ?? [];
    // Saves from before dialogue existed default to seen, so nobody gets a
    // dialogue popping up mid-fight after the update.
    this.dialogueSeen = userData.dialogueSeen ?? true;
    this.outroSeen = userData.outroSeen ?? true;
    this.endingSeen = userData.endingSeen ?? false;
    this.secretEndingSeen = userData.secretEndingSeen ?? false;
    this.selectedPowerUps = userData.selectedPowerUps ?? [];
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
      powerUpsUsed: this.powerUpsUsedThisStage,
      result: bossResult,
    });
  }

  // The current boss just died. Ends the run on the final stage, otherwise
  // parks at the interstitial until the player asks for the next enemy.
  //
  // Idempotent: a card dragged during the 1.8s death-animation window (the UI
  // still shows the battle while result is already 'stageCleared'/'win') fires
  // another game.executeCard on the corpse, which would otherwise push a second
  // recap entry for the boss just beaten.
  clearStage(): void {
    if (this.result !== 'playing') return;
    this.finalizeBossRecap('win');
    this.clearTimerDebuff();
    
    const continueToFinalBoss = this.stage === (SECRET_BOSS_STAGE - 1) && this.shouldContinueToSecretBoss();
    this.result = this.stage >= getFinalStageFromDifficulty(this.difficulty) && !continueToFinalBoss ? 'win' : 'stageCleared';

    // Don't provide power ups when progressing to the secret boss
    if (this.result === 'stageCleared' && !continueToFinalBoss) {
      this.powerUpChoices = pickRandomPowerUps(3, this.selectedPowerUps).map((p) => p.powerUpId);
    }
  }

  // Player picked this reward on the stage-clear screen. Validated against
  // the offered choices so only an option actually shown can be saved.
  choosePowerUp(powerUpId: string): void {
    if (this.result !== 'stageCleared') {
      throw new Error('Cannot choose a power-up outside the stage-clear screen');
    }
    if (!this.powerUpChoices.includes(powerUpId)) {
      throw new Error(`"${powerUpId}" was not offered as a choice`);
    }
    this.powerUps.push(powerupRegistry.create(powerUpId));
    this.powerUpChoices = [];
    this.selectedPowerUps = [...new Set([...this.selectedPowerUps, powerUpId])];
  }

  // Player clicked an inventory slot mid-battle to trigger its effect.
  // Consumable power-ups (consumedOnUse) are removed for the rest of the run;
  // the rest are disabled until the next stage. A power-up that had nothing
  // to do (e.g. empty hand) is left unspent.
  usePowerUp(index: number): void {
    if (this.result !== 'playing') {
      throw new Error('Cannot use a power-up outside of battle');
    }
    const powerUp = this.powerUps[index];

    if (powerUp === undefined) {
      throw new Error(`No Power Up at inventory index ${index}`);
    }

    if (!powerUp.isAvailable()) {
      throw new Error(`Power Up unavailable: ${powerUp.powerUpId}`);
    }

    if (!powerUp.applyTo(this)) return;

    this.powerUpsUsedThisStage += 1;

    if (powerUp.consumedOnUse ?? false) {
      // Remove by slot (not id) so the clicked copy is the one removed
      this.powerUps.splice(index, 1);
    } else {
      powerUp.available = false;
    }
  }

  // Once-per-stage power-ups become usable again at the start of a stage.
  refreshPowerUps(): void {
    this.powerUps.forEach((powerUp) => {
      powerUp.available = true;
    });
  }

  // Player confirmed "Next Enemy" on the stage-clear screen.
  //
  // The deck is rebuilt from this run's baseDeck and never from the player's
  // saved nextDeck - that is what locks the deck for the duration of a run.
  //
  // `seen` is the account-level record of dialogue the player has already
  // watched (in any run), so a restarted run does not replay it.
  advanceStage(seen?: SeenDialogue | null): void {
    if (this.result !== 'stageCleared') {
      throw new Error('Cannot advance: the current stage is not cleared');
    }

    this.stage += 1;
    const { BossClass } = getStageConfig(this.stage);
    if (this.stage !== SECRET_BOSS_STAGE) {
      this.enemy = new BossClass();
      
      this.debuffsFaced = [...new Set([...this.debuffsFaced, ...this.enemy.debuffs])];
    } else {
      this.enemy = new BossClass({ debuffs: this.debuffsFaced });
    }
    this.deck = this.freshDeckFromBase();
    this.hand = [];
    this.result = 'playing';
    this.stageStartedAt = Date.now();
    this.cardsUsedThisStage = 0;
    this.powerUpsUsedThisStage = 0;
    this.dialogueSeen = !shouldShowDialogue(this.stage, 'intro', seen);
    this.outroSeen = !shouldShowDialogue(this.stage, 'outro', seen);
    this.refreshPowerUps();
    
    this.shuffle();
    this.activateEnemyDebuffs();
    this.draw();
  }

  // The stage has been dealt but the pre-battle dialogue has not been
  // dismissed yet. The fight has not started: no card, power-up, end-turn or
  // timer heartbeat may act on it until finishDialogue().
  isIntroPending(): boolean {
    return this.result === 'playing' && !this.dialogueSeen;
  }

  // The boss is down but the post-battle dialogue has not been dismissed yet,
  // so the stage-clear / result screen is held back.
  isOutroPending(): boolean {
    return (
      (this.result === 'stageCleared' || this.result === 'win') &&
      !this.outroSeen
    );
  }

  // Player finished or skipped the pre-battle dialogue - this is the moment
  // the fight actually begins. Restarts the stage clock so the boss recap time
  // doesn't count time spent reading, and makes sure no timer-debuff countdown
  // is running from before the fight started.
  finishDialogue(now: number = Date.now()): void {
    this.dialogueSeen = true;
    this.stageStartedAt = now;
    this.clearTimerDebuff();
  }

  // Player finished or skipped the post-battle dialogue.
  finishOutro(): void {
    this.outroSeen = true;
  }

  isEndingPending(): boolean {
    return (
      this.result === 'win' &&
      this.outroSeen &&
      ((this.stage === getFinalStageFromDifficulty(this.difficulty) && !this.endingSeen) ||
        (this.stage === SECRET_BOSS_STAGE && !this.secretEndingSeen))
    );
  }

  finishEnding(): void {
    if (this.stage === SECRET_BOSS_STAGE) {
      this.secretEndingSeen = true;
    } else {
      this.endingSeen = true;
    }
  }

  /**
   * Function to determine if the user should continue to the secret boss
   * @returns Boolean value
   */
  shouldContinueToSecretBoss(): boolean {
    const powerUpsUsedOverall = this.bossRecap.reduce((sum, recap) => sum + recap.powerUpsUsed, 0);

    return powerUpsUsedOverall === 0;
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

  // `seen` is the account-level record of dialogue already watched, so
  // restarting a run skips any dialogue the player has seen before.
  static newGame(userId: string, deck?: cardData[] | null, difficulty?: Difficulty, seen?: SeenDialogue | null): UserData {
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
      difficulty: difficulty ?? "easy",
      scene,
      result: 'playing',
      bossRecap: [],
      stageStartedAt: Date.now(),
      cardsUsedThisStage: 0,
      powerUpsUsedThisStage: 0,
      debuffsFaced: [],
      lastActiveAt: Date.now(),
      powerUps: [],
      powerUpChoices: [],
      dialogueSeen: !shouldShowDialogue(stage, 'intro', seen),
      outroSeen: !shouldShowDialogue(stage, 'outro', seen),
      endingSeen: !!seen?.[dialogueKey(getFinalStageFromDifficulty(difficulty ?? "easy"))]?.ending,
      secretEndingSeen: !!seen?.[dialogueKey(SECRET_BOSS_STAGE)]?.ending,
      selectedPowerUps: [],
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
      difficulty: this.difficulty,
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
      powerUpsUsedThisStage: this.powerUpsUsedThisStage,
      debuffsFaced: this.debuffsFaced,
      lastActiveAt: this.lastActiveAt,
      powerUps: this.powerUps,
      powerUpChoices: this.powerUpChoices,
      dialogueSeen: this.dialogueSeen,
      outroSeen: this.outroSeen,
      endingSeen: this.endingSeen,
      secretEndingSeen: this.secretEndingSeen,
      selectedPowerUps: this.selectedPowerUps,
    };
  }
}