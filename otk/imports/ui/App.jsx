import React from 'react';
import CardHand from './cards/CardHand';

export const App = () => (
  <div className="bg-gray-800 min-h-screen">
    <div className="page flex grow">
      <CardHand cards={cards} />
    </div>
  </div>
);
