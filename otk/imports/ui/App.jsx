import React from 'react';
import Card from './Card';
import { FerociousClaw } from '../engine/card/FerociousClaw';

// const card = { name: "ferocious", currentCost: 10, currentAttack: 14, description: 'a nice description'};

export const App = () => (
  <div className="page">
    <h1>Hello</h1>
    <Card cardProps={new FerociousClaw()} />
  </div>
);
