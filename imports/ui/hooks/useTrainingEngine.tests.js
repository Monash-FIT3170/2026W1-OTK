import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { useTrainingEngine } from './useTrainingEngine.js';
import { FogClearing } from '../../engine/card/FogClearing';
import { HelpingHand } from '../../engine/card/HelpingHand';

// A deliberately small deck (all cost-2, selection-free cards) so
// exhausting it and triggering the auto-refill is easy to force in a
// test. Kept larger than the starting hand size so the very first hand
// still has enough left in the deck to actually afford a play.
const tinyDeck = () =>
  Array.from({ length: 8 }, () => new FogClearing().toJSON());

if (Meteor.isClient) {
  describe('useTrainingEngine', function () {
    it('starts with a hand of cards and a non-empty deck', function () {
      const { result } = renderHook(() => useTrainingEngine());
      assert.isAbove(result.current.hand.length, 0);
      assert.isAbove(result.current.deck.length, 0);
    });

    it('starts with the Training Dummy at full health', function () {
      const { result } = renderHook(() => useTrainingEngine());
      assert.equal(result.current.enemy.currentHealth, result.current.enemy.health);
      assert.equal(result.current.enemy.name, 'Training Dummy');
    });

    it('uses the deck passed in rather than the default starting deck', function () {
      const { result } = renderHook(() => useTrainingEngine(tinyDeck()));
      const cardIds = new Set(
        [...result.current.hand, ...result.current.deck].map((c) => c.cardId)
      );
      assert.deepEqual([...cardIds], ['fog-clearing']);
    });

    // The default starting deck (see engine/DeckBuilder.ts) isn't reliable
    // for asserting damage was dealt: besides selection-required cards
    // (Transcode, TeaCeremony, DivideAndConquer — covered by its own test
    // below), it also has non-damage utility cards like Final Stand (cost
    // 0, no selection, discards/cost-reduces instead of hitting the
    // enemy). Since the deck is shuffled, hand[0] could land on any of
    // these, so tests that need a hit to actually land use a controlled
    // deck of FogClearing (12 flat damage, no selection) instead.
    it('playing a card reduces the enemy health and removes the card from hand', function () {
      const { result } = renderHook(() => useTrainingEngine(tinyDeck()));
      const startingHealth = result.current.enemy.currentHealth;
      const cardToPlay = result.current.hand[0];

      act(() => {
        result.current.playCard(cardToPlay.uniqueId);
      });

      assert.isBelow(result.current.enemy.currentHealth, startingHealth);
      assert.equal(result.current.cardsPlayedCount, 1);
      assert.isFalse(
        result.current.hand.some((c) => c.uniqueId === cardToPlay.uniqueId)
      );
    });

    it('the Training Dummy resets to full health instead of dying', function () {
      // Needs enough total damage to actually push the dummy's 1000
      // starting health to (and past) zero, so a plain FogClearing deck
      // is used rather than the default shuffled starting deck.
      const bigDeck = Array.from({ length: 200 }, () =>
        new FogClearing().toJSON()
      );
      const { result } = renderHook(() => useTrainingEngine(bigDeck));

      for (let i = 0; i < 90; i++) {
        act(() => {
          result.current.playCard(result.current.hand[0].uniqueId);
        });
        assert.isAbove(result.current.enemy.currentHealth, 0);
      }
    });

    it('auto-refills the deck and hand once no card in hand can still be played', function () {
      const { result } = renderHook(() => useTrainingEngine(tinyDeck()));

      // Drain the tiny deck by playing every affordable card in hand.
      let guard = 0;
      while (guard < 20) {
        const playable = result.current.hand.find(
          (c) => c.currentCost <= result.current.deck.length
        );
        if (!playable) break;
        act(() => {
          result.current.playCard(playable.uniqueId);
        });
        guard += 1;
      }

      assert.isAbove(result.current.deckRefillCount, 0);
      // Session keeps going: there's still something in hand to play.
      assert.isAbove(result.current.hand.length, 0);
    });

    it('a card requiring a selection stages a pendingSelection instead of executing immediately', function () {
      const deck = Array.from({ length: 8 }, () => new HelpingHand().toJSON());
      const { result } = renderHook(() => useTrainingEngine(deck));
      const cardToPlay = result.current.hand[0];
      const otherCard = result.current.hand.find(
        (c) => c.uniqueId !== cardToPlay.uniqueId
      );

      act(() => {
        result.current.playCard(cardToPlay.uniqueId);
      });

      assert.isOk(result.current.pendingSelection);
      assert.equal(result.current.cardsPlayedCount, 0);

      act(() => {
        result.current.confirmSelection([otherCard.uniqueId]);
      });

      assert.isNull(result.current.pendingSelection);
      assert.equal(result.current.cardsPlayedCount, 1);
    });

    it('starts with zero damage dealt', function () {
      const { result } = renderHook(() => useTrainingEngine());
      assert.equal(result.current.totalDamageDealt, 0);
    });

    it('playing a card increases totalDamageDealt by the amount of damage dealt', function () {
      // FogClearing deals a fixed 12 damage (see engine/card/FogClearing.ts),
      // and the Training Dummy starts with far more health than that, so
      // this is a plain hit with no reset to complicate the math.
      const { result } = renderHook(() => useTrainingEngine(tinyDeck()));

      act(() => {
        result.current.playCard(result.current.hand[0].uniqueId);
      });

      assert.equal(result.current.totalDamageDealt, 12);
    });

    it('keeps counting the exact damage dealt through the Training Dummy resetting to full health', function () {
      // A big, purely selection-free deck so this can play through many
      // hits (enough to push the dummy's 1000 starting health past zero
      // at least once, forcing a reset) without ever hitting a selection
      // panel or running dry.
      const bigDeck = Array.from({ length: 200 }, () =>
        new FogClearing().toJSON()
      );
      const { result } = renderHook(() => useTrainingEngine(bigDeck));

      const HITS = 90;
      for (let i = 0; i < HITS; i++) {
        act(() => {
          result.current.playCard(result.current.hand[0].uniqueId);
        });
      }

      // Damage is tallied from the exact amount passed to the enemy's own
      // takeDamage() (see instrumentDamageTracking in trainingEngine.js),
      // not inferred from health before/after — so this must land on
      // exactly 90 * 12, with nothing lost to the dummy's health clamping
      // at 0 or resetting back to full partway through.
      assert.equal(result.current.totalDamageDealt, HITS * 12);
    });

    it('never calls a real Meteor method when playing a card', function () {
      let called = false;
      const originalCall = Meteor.call;
      Meteor.call = () => {
        called = true;
      };

      const { result } = renderHook(() => useTrainingEngine());
      act(() => {
        result.current.playCard(result.current.hand[0].uniqueId);
      });

      assert.isFalse(called);
      Meteor.call = originalCall;
    });
  });
}