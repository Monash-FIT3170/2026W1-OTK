import React from 'react';
import CardHand from './cards/CardHand';

const dummyCards = {
  card1: {
    name: 'Ferocious Claw',
    baseCost: 2,
    currentCost: 2,
    baseAttack: 5,
    currentAttack: 5,
    description: 'Deal 5 damage to the enemy. Gain 1 extra attack for each wound on the target.',
  },
  card2: {
    name: 'Fog Clearing',
    baseCost: 1,
    currentCost: 1,
    baseAttack: null,
    currentAttack: null,
    description: 'Draw 2 cards. Reduce the cost of the next card played by 1.',
  },
  card3: {
    name: 'Transcode',
    baseCost: 3,
    currentCost: 2,
    baseAttack: 8,
    currentAttack: 10,
    description: 'Convert all shield into attack damage. Deals bonus damage equal to shields consumed.',
  },
  card4: {
    name: 'Stone Wall',
    baseCost: 2,
    currentCost: 2,
    baseAttack: null,
    currentAttack: null,
    description: 'Gain 8 shield. If you have no cards in hand after playing this, gain 4 extra shield.',
  },
  card5: {
    name: 'Shadow Strike',
    baseCost: 1,
    currentCost: 1,
    baseAttack: 3,
    currentAttack: 3,
    description: 'Deal 3 damage. If played first this turn, deal 6 damage instead and draw a card.',
  },
};

export const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-end p-4">
      <CardHand cards={dummyCards} />
    </div>
  );
};
