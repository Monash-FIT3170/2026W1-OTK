// tutorialEngine.js
//
// Creates a real GameEngine instance for the interactive tutorial —
// running entirely in the browser, never persisted, never touching
// Meteor.call or UserDataCollection. This works because GameEngine (and
// Card/Enemy) have zero Meteor dependencies: the real game.* Meteor
// methods are just thin wrappers around this same engine.
//
// The tutorial deck is deliberately curated to only selection-free
// cards (no cardAmountToSelect), so a guided "play a card" step always
// succeeds immediately with no selection UI needed. The enemy is a
// debuff-free Goblin, so nothing unpredictable (Freeze/Timer) interrupts
// the guided steps.

import { GameEngine } from '../../engine/GameEngine';
import { Goblin } from '../../engine/enemy/enemies/Goblin';
import { FogClearing } from '../../engine/card/FogClearing';
import { AirKnife } from '../../engine/card/AirKnife';

const TUTORIAL_STARTING_HAND_SIZE = 3;

export function createTutorialEngine() {
  // Passing debuffs: [] (not undefined) skips Goblin's default
  // Timer/Freeze debuffs — see Goblin.ts's `data.debuffs === undefined` check.
  const enemy = new Goblin({ debuffs: [] });

  const deck = [
    ...Array.from({ length: 6 }, () => new FogClearing().toJSON()),
    ...Array.from({ length: 4 }, () => new AirKnife().toJSON()),
  ];

  const userData = {
    userId: 'tutorial-local',
    stage: 1,
    deck,
    hand: [],
    enemy: enemy.toJSON(),
    scene: 'underpass-overlaid',
    result: 'playing',
  };

  const engine = new GameEngine(userData);
  engine.shuffle();
  engine.draw(TUTORIAL_STARTING_HAND_SIZE);
  return engine;
}