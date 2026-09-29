import { useRef, useState, useCallback } from 'react';
import { soundManager } from '../soundManager';
import {
  createTrainingEngine,
  TRAINING_STARTING_HAND_SIZE,
} from '../training/trainingEngine';

// Wraps a real, local GameEngine instance for Training Mode. playCard/
// confirmSelection are the local equivalents of the real game.drawCards /
// game.executeCard Meteor methods (see hooks/usePlayCard.js), except they
// mutate the local engine directly instead of calling the server —
// nothing here ever touches UserDataCollection or Meteor.call.
//
// Unlike the tutorial's engine hook, this one:
//  - accepts the player's own real saved deck (any card, including ones
//    that require a target selection), so it mirrors usePlayCard's
//    drawCost -> (maybe select) -> executeCard flow in full, and
//  - never ends: whenever no card in hand can still be played, the deck
//    and hand are silently rebuilt from the starting deck and reshuffled,
//    so the player can keep attacking the Training Dummy indefinitely.
export function useTrainingEngine(savedDeck) {
  const engineRef = useRef(null);
  if (!engineRef.current) {
    engineRef.current = createTrainingEngine(savedDeck);
  }

  // Bumped after every mutation to force a re-render, since GameEngine
  // mutates itself in place rather than being immutable.
  const [, setVersion] = useState(0);
  const [cardsPlayedCount, setCardsPlayedCount] = useState(0);
  const [deckRefillCount, setDeckRefillCount] = useState(0);

  // Running total of damage dealt to the Training Dummy this session — the
  // on-screen tracker (TrainingModeScreen) reads this directly, and it's
  // what gets saved as the player's personal best when they exit. Kept
  // client-side and reset by starting a new session (a fresh mount of this
  // hook); nothing here is persisted mid-session.
  //
  // The authoritative number lives on the enemy instance itself
  // (enemy.trainingDamageDealt, set up in trainingEngine.js's
  // instrumentDamageTracking) rather than being derived here from
  // before/after health snapshots — health clamps at 0 and the dummy
  // resets on top of that, so any overkill on a killing blow would
  // otherwise be lost. This state just mirrors that counter so React
  // re-renders when it changes.
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const cycleStartingDamage = useRef(0);
  const [currentCycleDamage, setCurrentCycleDamage] = useState(0);
  const [bestCycleDamage, setBestCycleDamage] = useState(0);
  const [lastCycleDamage, setLastCycleDamage] = useState(null);

  // Mirrors usePlayCard's pendingSelection shape so the real, presentational
  // SelectionPanel component can be reused as-is.
  const [pendingSelection, setPendingSelection] = useState(null);

  // Both exhaustion and a manual restart end the current cycle. On a
  // restart, last-cycle damage is the damage achieved before stopping.
  const startNextCycle = useCallback((engine) => {
    const total = engine.enemy.trainingDamageDealt;
    setLastCycleDamage(total - cycleStartingDamage.current);
    cycleStartingDamage.current = total;
    setCurrentCycleDamage(0);
    setPendingSelection(null);
    engine.deck = engine.freshDeckFromBase();
    engine.hand = [];
    engine.shuffle();
    engine.draw(TRAINING_STARTING_HAND_SIZE);
    setDeckRefillCount((count) => count + 1);
  }, []);

  const restartCycle = useCallback(() => {
    const engine = engineRef.current;
    startNextCycle(engine);
    engine.enemy.currentHealth = engine.enemy.health;
    setVersion((v) => v + 1);
  }, [startNextCycle]);

  // If nothing left in hand can still be played (out of cards, or not
  // enough left in the deck to pay any remaining card's cost), reshuffle a
  // fresh copy of the starting deck back in. Training Mode has no win/loss
  // condition, so running out of cards should never end the session.
  const finishPlay = useCallback((engine) => {
    // Record the final hit before refilling. Dummy health resets do not
    // end a cycle; exhaustion or a manual restart does.
    const total = engine.enemy.trainingDamageDealt;
    const cycleDamage = total - cycleStartingDamage.current;
    setTotalDamageDealt(total);
    setCurrentCycleDamage(cycleDamage);
    setBestCycleDamage((best) => Math.max(best, cycleDamage));
    if (engine.hasPlayableCards()) return;
    startNextCycle(engine);
  }, [startNextCycle]);

  const playCard = useCallback((uniqueId) => {
    const engine = engineRef.current;
    const card = engine.hand.find((c) => c.uniqueId === uniqueId);
    if (!card || !card.isPlayable() || card.currentCost > engine.deck.length) {
      return;
    }

    const { requiresSelection, cardAmountToSelect } = engine.drawCost(uniqueId);

    if (requiresSelection) {
      // card.toJSON() so SelectionPanel (which expects plain card props,
      // same shape as the real game's `hand` entries) can render it as-is.
      setPendingSelection({
        uniqueCardId: uniqueId,
        card: card.toJSON(),
        cardAmountToSelect,
      });
      setVersion((v) => v + 1);
      return;
    }

    soundManager.playCardSound(card.cardId);
    engine.executeCard(uniqueId, []);
    finishPlay(engine);

    setCardsPlayedCount((count) => count + 1);
    setVersion((v) => v + 1);
  }, [finishPlay]);

  const confirmSelection = useCallback((selectedCardIds) => {
    const engine = engineRef.current;
    if (!pendingSelection) return;

    soundManager.playCardSound(pendingSelection.card.cardId);
    engine.executeCard(pendingSelection.uniqueCardId, selectedCardIds);
    finishPlay(engine);

    setPendingSelection(null);
    setCardsPlayedCount((count) => count + 1);
    setVersion((v) => v + 1);
  }, [pendingSelection, finishPlay]);

  const engine = engineRef.current;

  return {
    hand: engine.hand.map((c) => c.toJSON()),
    deck: engine.deck.map((c) => c.toJSON()),
    enemy: engine.enemy.toJSON(),
    cardsPlayedCount,
    deckRefillCount,
    totalDamageDealt,
    currentCycleDamage,
    bestCycleDamage,
    lastCycleDamage,
    restartCycle,
    pendingSelection,
    playCard,
    confirmSelection,
  };
}
