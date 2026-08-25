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

// data shape stored in UserDataCollection
export type UserData = {
  userId: string;
  stage: number;
  baseDeck: cardData[];
  deck: cardData[];
  hand: cardData[];
  enemy: EnemyData;
  scene?: string;
  result: 'win' | 'loss' | 'playing';
};
