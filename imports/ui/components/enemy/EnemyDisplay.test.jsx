import React from 'react';
import sinon from 'sinon';
import { Meteor } from 'meteor/meteor';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { EnemyDisplay } from './EnemyDisplay';
import { Goblin } from '/imports/engine/enemy/enemies/Goblin';
let goblin;
let animateSpy;
let fakeUseAnimate;

// EnemyDisplay detects damage by comparing enemy.currentHealth against the
// previous render, so tests trigger the hit sprite by re-rendering with a
// lower-health enemy rather than by passing a prop.
const damaged = (currentHealth) => new Goblin({ currentHealth });

// ─── Tests ───
if (Meteor.isClient) {
  describe('EnemyDisplay', () => {
    beforeEach(() => {
      goblin = new Goblin();
      animateSpy = sinon.stub().resolves();
      fakeUseAnimate = () => [
        { current: document.createElement('div') },
        animateSpy,
      ];
    });

    // 1. Renders the enemy image when isVisible is true
    it('renders the enemy image when visible', () => {
      render(
        <EnemyDisplay
          enemy={goblin}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      expect(screen.getByRole('img')).to.exist;
      expect(screen.getByRole('img').getAttribute('src')).to.equal(
        `/assets/sprites/enemies/${goblin.name.toLowerCase()}-enemy.gif`
      );
    });

    // 2. Renders nothing when isVisible is false
    it('renders nothing when not visible', () => {
      render(
        <EnemyDisplay
          enemy={goblin}
          isVisible={false}
          _useAnimate={fakeUseAnimate}
        />
      );

      expect(screen.queryByRole('img')).to.not.exist;
    });

    // 3. Shows the -attack sprite when the enemy loses health
    it('shows hit sprite when the enemy loses health', () => {
      // Keep the animation pending so the hit sprite is still showing when we assert.
      animateSpy = sinon.stub().returns(new Promise(() => {}));

      const { rerender } = render(
        <EnemyDisplay
          enemy={goblin}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      rerender(
        <EnemyDisplay
          enemy={damaged(50)}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      expect(screen.getByRole('img').getAttribute('src')).to.include('-attack');
    });

    // 4. Resets back to the normal sprite after the animation promise resolves
    it('resets to normal sprite after hit animation completes', async () => {
      const { rerender } = render(
        <EnemyDisplay
          enemy={goblin}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      rerender(
        <EnemyDisplay
          enemy={damaged(50)}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      // Checks the expect every 50ms for 1000ms
      // It doesnt need to be longer because we are mocking animations so they should be done instantly
      await waitFor(() => {
        expect(screen.getByRole('img').getAttribute('src')).to.not.include(
          '-attack'
        );
      });
    });

    // 5. onError falls back to normal sprite if the -attack sprite fails to load
    it('falls back to normal sprite if hit sprite fails to load', () => {
      // Keep the animation pending so the hit sprite is still showing when we assert.
      animateSpy = sinon.stub().returns(new Promise(() => {}));

      const { rerender } = render(
        <EnemyDisplay
          enemy={goblin}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      rerender(
        <EnemyDisplay
          enemy={damaged(50)}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      const img = screen.getByRole('img');

      fireEvent.error(img);

      expect(img.getAttribute('src')).to.equal(
        `/assets/sprites/enemies/${goblin.enemyId}-enemy.gif`
      );
    });
  });
}
