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
// succeeds immediately with no selection UI needed. The Training Dummy has
// no debuffs and resets its health instead of dying, so the player can keep
// practising until they choose to end the tutorial.

import { GameEngine } from '../../engine/GameEngine';
import { FogClearing } from '../../engine/card/FogClearing';
import { AirKnife } from '../../engine/card/AirKnife';
import { TrainingDummy } from '../../engine/enemy/enemies/TrainingDummy';

const TUTORIAL_STARTING_HAND_SIZE = 3;

export function createTutorialEngine() {
  const enemy = new TrainingDummy();

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
