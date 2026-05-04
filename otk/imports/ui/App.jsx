import React from 'react';
import CardHand from './cards/CardHand';

const cards = {
  card1: {
    name: 'ferocious',
    currentCost: 10,
    currentAttack: 10,
    description: 'a nice description',
  },
  card2: {
    name: 'i <3 OTK',
    currentCost: 20,
    currentAttack: 9,
    description: 'a scrappy description',
  },
  card3: {
    name: 'fog clearing',
    currentCost: 0,
    currentAttack: null,
    description: 'no description here',
  },
  card4: {
    name: 'transcode',
    currentCost: 40,
    currentAttack: 8,
    description: 'uhhhhh',
  },
  card5: {
    name: 'some card',
    currentCost: 1000,
    currentAttack: 34,
    description: 'a lame description',
  },
  card6: {
    name: 'another card',
    currentCost: 2,
    currentAttack: 1,
    description: 'a great description!',
  },
  card7: {
    name: 'yet another card',
    currentCost: 5,
    currentAttack: 4,
    description: 'running out of ideas',
  },
  card8: {
    name: 'last card',
    currentCost: 8,
    currentAttack: 3,
    description: 'quite tricky',
  },
  card9: {
    name: 'just kidding!',
    currentCost: 5,
    currentAttack: 4,
    description: 'some description',
  },
  card10: {
    name: 'lets',
    currentCost: 8,
    currentAttack: 3,
    description:
      "card with a super duper long description that probably will not be used in the game for real. I honestly don't think any card will require a description this long",
  },
  card11: { name: 'play', currentCost: 5, currentAttack: 4, description: 'c' },
  card12: { name: 'a', currentCost: 8, currentAttack: 3, description: 'b' },
  card13: { name: 'game', currentCost: 5, currentAttack: 4, description: 'a' },
  card14: {
    name: 'surprise! super long name for a card that has no real effect at all, everythign is hardcoded',
    currentCost: 8,
    currentAttack: 3,
    description: 'hello!',
  },
};

export const App = () => (
  <div className="bg-gray-800 min-h-screen">
    <div className="page flex grow">
      <CardHand cards={cards} />
    </div>
  </div>
);
