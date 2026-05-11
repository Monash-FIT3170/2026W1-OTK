import React from 'react';
import CardHand from './cards/CardHand';

const dummyCards = [
  {
    uniqueId: '1',
    cardId: 'ferocious-claw',
    name: 'Ferocious Claw',
    description: 'Discard 1 card from hand.',
    baseCost: 3,
    currentCost: 3,
    baseAttack: 24,
    currentAttack: 24,
    cardAmountToSelect: { min: 1, max: 1 },
  },
  {
    uniqueId: '2',
    cardId: 'ferocious-claw',
    name: 'Ferocious Claw',
    description: 'Discard 1 card from hand.',
    baseCost: 3,
    currentCost: 3,
    baseAttack: 24,
    currentAttack: 24,
    cardAmountToSelect: { min: 1, max: 1 },
  },
  {
    uniqueId: '3',
    cardId: 'fog-clearing',
    name: 'Fog Clearing',
    description: '',
    baseCost: 2,
    currentCost: 2,
    baseAttack: 12,
    currentAttack: 12,
  },
  {
    uniqueId: '4',
    cardId: 'fog-clearing',
    name: 'Fog Clearing',
    description: '',
    baseCost: 2,
    currentCost: 2,
    baseAttack: 12,
    currentAttack: 12,
  },
  {
    uniqueId: '5',
    cardId: 'transcode',
    name: 'Transcode',
    description: 'Return 3 cards from hand to deck.',
    baseCost: 4,
    currentCost: 4,
    cardAmountToSelect: { min: 3, max: 3 },
  },
  {
    uniqueId: '6',
    cardId: 'transcode',
    name: 'Transcode',
    description: 'Return 3 cards from hand to deck.',
    baseCost: 4,
    currentCost: 4,
    cardAmountToSelect: { min: 3, max: 3 },
  },
];

export const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-end p-4 -z-2">
      <CardHand cards={dummyCards} />
    </div>
  );
};
