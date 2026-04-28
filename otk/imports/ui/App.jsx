import React from 'react';
import Card from './Card';
// import { FerociousClaw } from '../engine/card/FerociousClaw';

const card = { name: "Ferocious Claw", baseCost: 10, currentCost: 10, currentAttack: 25, baseAttack: 10, description: 'a nice description asdasdasd asd asd asd as d asd asd asd asd as d asd asd asd as dasd  asd asd as d asasdasdasd asd as das dasd asd asd asd asd'};

export const App = () => (
  <div className="page">
    <Card cardProps={card} />
  </div>
);
