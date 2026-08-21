import { useRef, useState, useCallback } from 'react';
import { createTutorialEngine } from '../tutorial/tutorialEngine';

// Wraps a real, local GameEngine instance for the interactive tutorial.
// playCard/endTurn are the tutorial's equivalents of the real
// game.executeCard / game.endTurn Meteor methods, except they mutate the
// local engine directly instead of calling the server — nothing here
// ever touches UserDataCollection.
export function useTutorialEngine() {
  const engineRef = useRef(null);
  if (!engineRef.current) {
    engineRef.current = createTutorialEngine();
  }

  // Bumped after every mutation to force a re-render, since GameEngine
  // mutates itself in place rather than being immutable.
  const [, setVersion] = useState(0);
  const [cardsPlayedCount, setCardsPlayedCount] = useState(0);
  const [hasEndedTurn, setHasEndedTurn] = useState(false);

  const playCard = useCallback((uniqueId) => {
    const engine = engineRef.current;
    const card = engine.hand.find((c) => c.uniqueId === uniqueId);

    // The tutorial deck is curated to be entirely selection-free, and
    // isFrozen never applies (the Training Dummy has no debuffs), so
    // this is mostly a defensive guard against playing an unaffordable card.
    if (!card || !card.isPlayable() || card.currentCost > engine.deck.length) {
      return;
    }

    engine.drawCost(uniqueId);
    engine.executeCard(uniqueId, []);

    setCardsPlayedCount((count) => count + 1);
    setVersion((v) => v + 1);
  }, []);

  const endTurn = useCallback(() => {
    setHasEndedTurn(true);
  }, []);

  const engine = engineRef.current;

  return {
    hand: engine.hand.map((c) => c.toJSON()),
    deck: engine.deck.map((c) => c.toJSON()),
    enemy: engine.enemy.toJSON(),
    cardsPlayedCount,
    hasEndedTurn,
    playCard,
    endTurn,
  };
}
