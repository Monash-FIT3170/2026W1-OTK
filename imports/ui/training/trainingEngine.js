// trainingEngine.js
//
// Creates a real GameEngine instance for Training Mode — running entirely
// in the browser, never persisted, never touching Meteor.call or
// UserDataCollection. Same principle as the interactive tutorial
// (see ui/tutorial/tutorialEngine.js): GameEngine has zero Meteor
// dependencies, so it can be instantiated and played client-side.
//
// Unlike the tutorial (which uses a small curated, selection-free deck),
// Training Mode uses the player's own real saved deck, so they can
// practise with the exact cards they'll take into a real run. The
// Training Dummy has no debuffs and resets to full health instead of
// dying (see TrainingDummy.ts), so the player can keep attacking for as
// long as they like.

import { GameEngine } from '../../engine/GameEngine';
import { DeckBuilder } from '../../engine/DeckBuilder';
import { TrainingDummy } from '../../engine/enemy/enemies/TrainingDummy';

export const TRAINING_STARTING_HAND_SIZE = 5;

// Training Mode's dummy is deliberately much tankier than the Tutorial's
// (which keeps TrainingDummy's own default of 30 health) — the point here
// is extended free practice, not a quick one-or-two-card knockout. This
// only affects Training Mode: the Tutorial builds its own TrainingDummy
// instance separately (see tutorial/tutorialEngine.js) and is unaffected.
export const TRAINING_DUMMY_HEALTH = 1000;

// `savedDeck` should be the player's real saved deck (userData.nextDeck),
// as plain card data (cardId/uniqueId/etc), the same shape GameEngine
// already expects for userData.deck. Falls back to the same default
// starting deck the real game.newGame method uses when the player hasn't
// saved a deck of their own yet.
export function createTrainingEngine(savedDeck) {
  const deck =
    Array.isArray(savedDeck) && savedDeck.length > 0
      ? savedDeck
      : DeckBuilder.buildStartingDeck();

  const enemy = new TrainingDummy({ health: TRAINING_DUMMY_HEALTH });

  const userData = {
    userId: 'training-local',
    stage: 1,
    baseDeck: deck,
    deck,
    hand: [],
    enemy: enemy.toJSON(),
    scene: 'underpass-overlaid',
    result: 'playing',
  };

  const engine = new GameEngine(userData);
  engine.shuffle();
  engine.draw(TRAINING_STARTING_HAND_SIZE);

  // GameEngine's constructor rebuilds the enemy from the plain JSON above
  // via enemyRegistry.create(), so it's a *different* object than the
  // `enemy` variable above — this has to instrument engine.enemy itself,
  // the instance that will actually take every hit for the rest of the
  // session.
  instrumentDamageTracking(engine.enemy);

  return engine;
}

// Enemy.takeDamage() clamps health at 0 (`Math.max(0, currentHealth -
// amount)`), and TrainingDummy resets straight back to full on top of
// that — so by the time a card's damage shows up as a currentHealth
// change, any overkill past 0 is already gone. There's no way to recover
// the real number from health alone. Instead, this wraps the enemy's own
// takeDamage with a running total of every raw `amount` it's ever been
// called with, captured before either of those clamps happen — an exact
// count, not an approximation from before/after health snapshots.
function instrumentDamageTracking(enemy) {
  enemy.trainingDamageDealt = 0;
  const originalTakeDamage = enemy.takeDamage.bind(enemy);
  enemy.takeDamage = (amount) => {
    enemy.trainingDamageDealt += amount;
    originalTakeDamage(amount);
  };
}