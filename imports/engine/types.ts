// types.ts
// shared data types for the game engine and API collections

// data shape for a card (stored in UserData.deck and Hand collection)
export type cardData = {
  cardId: string;
  name: string;
  description: string;
  baseCost: number;
  currentCost: number;
  baseAttack?: number;
  currentAttack?: number;
  cardAmountToSelect?: { min: number; max: number };
};

// data shape stored in UserDataCollection
export type UserData = {
  userId: string;
  stage: number;
  deck: cardData[];
};

// data shape stored in the Hand collection (one document per card in hand)
export type HandCardData = cardData & { userId: string };

// data shape stored in the Enemy collection (one document per user's current enemy)
export type EnemyData = {
  userId: string;
  enemyId: string;
  name: string;
  health: number;
  currentHealth: number;
  debuffs: string[];
};
