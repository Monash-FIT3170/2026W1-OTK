// types.ts
// shared data types for the game engine and API collections

// data shape for a card (stored in UserData.deck and UserData.hand)
export type cardData = {
  cardId: string;
  uniqueId?: string; // assigned on draw; required for hand cards, absent for deck cards
  name: string;
  description: string;
  baseCost: number;
  currentCost: number;
  baseAttack?: number;
  currentAttack?: number;
  cardAmountToSelect?: { min: number; max: number };
  maxCopies: number;
  isFrozen?: boolean;
};

// data shape for an enemy (embedded in UserData)
export type EnemyData = {
  enemyId: string;
  name: string;
  health: number;
  currentHealth: number;
  debuffs: string[];
  entryAnimation: string;
  hitAnimation: string;
  timerDebuffActive?: boolean;
  timerDebuffDeadline?: number;
  timerDebuffInterval?: number;
  timerDebuffTickAmount?: number;
};

// Where a run currently sits.
// - 'playing'      an active boss fight
// - 'stageCleared' boss down, parked on the interstitial waiting for "Next Enemy"
// - 'win'          final stage cleared, run complete
// - 'loss'         run over
export type RunResult = 'playing' | 'stageCleared' | 'win' | 'loss';

// per-boss recap entry recorded when a boss fight ends
export type BossRecapEntry = {
  bossName: string;
  stage: number;
  timeMs: number; // wall-clock milliseconds spent on this boss
  cardsUsed: number; // number of cards executed against this boss
  result: 'win' | 'loss';
};

// data shape stored in UserDataCollection
export type UserData = {
  userId: string;
  stage: number;
  baseDeck?: cardData[];
  deck: cardData[];
  hand: cardData[];
  enemy: EnemyData;
  scene?: string;
  result: RunResult;
  bossRecap?: BossRecapEntry[]; // accumulated recap entries across stages
  stageStartedAt?: number; // Date.now() timestamp when current stage began
  cardsUsedThisStage?: number; // cards executed against the current boss
  lastActiveAt?: number; // Date.now() of the last server-side action or heartbeat
};
