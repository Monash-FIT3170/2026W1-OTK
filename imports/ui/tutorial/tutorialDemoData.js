// tutorialDemoData.js
//
// Fixed, fake data used only to give the tutorial overlay something
// realistic-looking to sit on top of. None of this is ever read from or
// written to UserDataCollection — it exists purely for display.

export const tutorialDemoEnemy = {
  enemyId: 'goblin',
  name: 'Goblin',
  health: 100,
  currentHealth: 100,
  debuffs: [],
  entryAnimation: 'drop',
  hitAnimation: 'squish',
};

export const tutorialDemoHand = [
  {
    cardId: 'transcode',
    uniqueId: 'demo-1',
    name: 'Transcode',
    description: 'Return this card to the deck.',
    baseCost: 0,
    currentCost: 0,
    baseAttack: 0,
    currentAttack: 0,
  },
  {
    cardId: 'fog-clearing',
    uniqueId: 'demo-2',
    name: 'Fog Clearing',
    description: 'Deal a small amount of damage.',
    baseCost: 1,
    currentCost: 1,
    baseAttack: 10,
    currentAttack: 10,
  },
  {
    cardId: 'ferocious-claw',
    uniqueId: 'demo-3',
    name: 'Ferocious Claw',
    description: 'Deal a large amount of damage.',
    baseCost: 2,
    currentCost: 2,
    baseAttack: 20,
    currentAttack: 20,
  },
];

export const tutorialDemoDeckSize = 12;