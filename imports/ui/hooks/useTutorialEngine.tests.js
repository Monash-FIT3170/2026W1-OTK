import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { useTutorialEngine } from './useTutorialEngine.js';

if (Meteor.isClient) {
  describe('useTutorialEngine', function () {
    it('starts with a hand of cards and a non-empty deck', function () {
      const { result } = renderHook(() => useTutorialEngine());
      assert.isAbove(result.current.hand.length, 0);
      assert.isAbove(result.current.deck.length, 0);
    });

    it('starts with the enemy at full health', function () {
      const { result } = renderHook(() => useTutorialEngine());
      assert.equal(result.current.enemy.currentHealth, result.current.enemy.health);
    });

    it('playing a card reduces enemy health and increments cardsPlayedCount', function () {
      const { result } = renderHook(() => useTutorialEngine());
      const startingHealth = result.current.enemy.currentHealth;
      const cardToPlay = result.current.hand[0];

      act(() => {
        result.current.playCard(cardToPlay.uniqueId);
      });

      assert.equal(result.current.cardsPlayedCount, 1);
      assert.isBelow(result.current.enemy.currentHealth, startingHealth);
    });

    it('playing a card removes it from hand', function () {
      const { result } = renderHook(() => useTutorialEngine());
      const cardToPlay = result.current.hand[0];

      act(() => {
        result.current.playCard(cardToPlay.uniqueId);
      });

      const stillInHand = result.current.hand.some(
        (c) => c.uniqueId === cardToPlay.uniqueId
      );
      assert.isFalse(stillInHand);
    });

    it('never calls a real Meteor method when playing a card', function () {
      let called = false;
      const originalCall = Meteor.call;
      Meteor.call = () => { called = true; };

      const { result } = renderHook(() => useTutorialEngine());
      act(() => {
        result.current.playCard(result.current.hand[0].uniqueId);
      });

      assert.isFalse(called);
      Meteor.call = originalCall;
    });

    it('endTurn sets hasEndedTurn without calling any Meteor method', function () {
      let called = false;
      const originalCall = Meteor.call;
      Meteor.call = () => { called = true; };

      const { result } = renderHook(() => useTutorialEngine());
      act(() => {
        result.current.endTurn();
      });

      assert.isTrue(result.current.hasEndedTurn);
      assert.isFalse(called);
      Meteor.call = originalCall;
    });
  });
}