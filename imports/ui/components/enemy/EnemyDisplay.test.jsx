import React from 'react';
import sinon from 'sinon';
import { Meteor } from 'meteor/meteor';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { expect } from 'chai';
import { EnemyDisplay } from './EnemyDisplay';
import { Goblin } from '/imports/engine/enemy/enemies/Goblin';
import { Frostwarden } from '/imports/engine/enemy/enemies/Frostwarden';

let goblin;
let animateSpy;
let fakeUseAnimate;

const damaged = (currentHealth) => new Goblin({ currentHealth });

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

    // 1. Initial entry state & timer transition to idle using scoped fake timers
    it('renders entry sprite initially and switches to idle after timer', () => {
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      try {
        render(
          <EnemyDisplay
            enemy={goblin}
            isVisible={true}
            _useAnimate={fakeUseAnimate}
          />
        );

        const img = screen.getByRole('img');

        // Verify initial entry sprite
        expect(img.getAttribute('src')).to.equal(
          '/assets/sprites/enemies/goblin-entry-enemy.gif'
        );

        act(() => clock.tick(1500));

        expect(img.getAttribute('src')).to.equal(
          '/assets/sprites/enemies/goblin-enemy.gif'
        );
      } finally {
        clock.restore();
      }
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

    // 3. Shows hit sprite (-attack) on health loss
    it('shows hit sprite when the enemy loses health', async () => {
      animateSpy = sinon.stub().returns(new Promise(() => {}));

      const { rerender } = render(
        <EnemyDisplay
          enemy={goblin}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('img').getAttribute('src')).to.include('-enemy');
      }, { timeout: 1500 });

      rerender(
        <EnemyDisplay
          enemy={damaged(50)}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      expect(screen.getByRole('img').getAttribute('src')).to.include('-attack');
    });

    // 4. Shows die sprite (-die) when health drops to 0 or below
    it('shows die sprite when enemy health drops to 0', async () => {
      const { rerender } = render(
        <EnemyDisplay
          enemy={goblin}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('img').getAttribute('src')).to.include('-enemy');
      }, { timeout: 1500 });

      rerender(
        <EnemyDisplay
          enemy={damaged(0)}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      expect(screen.getByRole('img').getAttribute('src')).to.include('-die');
    });

    // 5. Resets back to normal sprite after hit animation completes
    it('resets to normal sprite after hit animation completes', async () => {
      const { rerender } = render(
        <EnemyDisplay
          enemy={goblin}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('img').getAttribute('src')).to.include('-enemy');
      }, { timeout: 1500 });

      rerender(
        <EnemyDisplay
          enemy={damaged(50)}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('img').getAttribute('src')).to.not.include(
          '-attack'
        );
      });
    });

    // 6. Custom sizing and horizontal offset classes matching component definitions
    it('applies custom size and offset classes for Frostwarden/Dragon', () => {
      const frostwarden = new Frostwarden();

      render(
        <EnemyDisplay
          enemy={frostwarden}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      const img = screen.getByRole('img');
      expect(img.getAttribute('src')).to.include('dragon');
      expect(img.className).to.include('h-100');
      expect(img.className).to.include('translate-x-100');
    });

    // 7. Cascading onError fallback sequence
    it('falls back from state GIF to idle GIF, idle PNG, and finally placeholder PNG', () => {
      render(
        <EnemyDisplay
          enemy={goblin}
          isVisible={true}
          _useAnimate={fakeUseAnimate}
        />
      );

      const img = screen.getByRole('img');

      fireEvent.error(img);
      expect(img.getAttribute('src')).to.equal(
        '/assets/sprites/enemies/goblin-enemy.gif'
      );

      fireEvent.error(img);
      expect(img.getAttribute('src')).to.equal(
        '/assets/sprites/enemies/goblin-enemy.png'
      );

      fireEvent.error(img);
      expect(img.getAttribute('src')).to.equal(
        '/assets/sprites/enemies/placeholder-enemy.png'
      );
    });
  });
}