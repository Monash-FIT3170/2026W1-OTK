import React from 'react';
import sinon from 'sinon';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { EnemyDisplay } from './EnemyDisplay';
import { Goblin } from '/imports/engine/enemy/enemies/Goblin';

let goblin;
let animateSpy;
let fakeUseAnimate;

beforeEach(() => {
  goblin = new Goblin();
  animateSpy = sinon.stub().resolves();
  fakeUseAnimate = () => [{ current: document.createElement('div') }, animateSpy];
});

// ─── Tests ───

describe('EnemyDisplay', () => {

  // 1. Renders the enemy image when isVisible is true
  it('renders the enemy image when visible', () => {
    render(<EnemyDisplay enemy={goblin} isVisible={true} isTakingDamage={false} _useAnimate={fakeUseAnimate} />);

    expect(screen.getByRole('img')).to.exist;
    expect(screen.getByRole('img').getAttribute('src')).to.equal(
      `/assets/sprites/enemies/${goblin.name.toLowerCase()}-enemy.png`
    );
  });


  // 2. Renders nothing when isVisible is false
  it('renders nothing when not visible', () => {
    render(<EnemyDisplay enemy={goblin} isVisible={false} isTakingDamage={false} _useAnimate={fakeUseAnimate} />);

    expect(screen.queryByRole('img')).to.not.exist;
  });


  // 3. Shows the -hit sprite when isTakingDamage flips to true
  it('shows hit sprite when isTakingDamage becomes true', () => {
    const { rerender } = render(
      <EnemyDisplay enemy={goblin} isVisible={true} isTakingDamage={false} _useAnimate={fakeUseAnimate} />
    );

    rerender(<EnemyDisplay enemy={goblin} isVisible={true} isTakingDamage={true} _useAnimate={fakeUseAnimate} />);

    expect(screen.getByRole('img').getAttribute('src')).to.include('-hit')
  });


  // 4. Resets back to the normal sprite after the animation promise resolves
  it('resets to normal sprite after hit animation completes', async () => {
    const { rerender } = render(
      <EnemyDisplay enemy={goblin} isVisible={true} isTakingDamage={false} _useAnimate={fakeUseAnimate} />
    );

    rerender(<EnemyDisplay enemy={goblin} isVisible={true} isTakingDamage={true} _useAnimate={fakeUseAnimate} />);

    // Checks the expect every 50ms for 1000ms 
    // It doesnt need to be longer because we are mocking animations so they should be done instantly
    await waitFor(() => {
      expect(screen.getByRole('img').getAttribute('src')).to.not.include('-hit');
});
  });


  // 5. onError falls back to normal sprite if the -hit sprite fails to load
  it('falls back to normal sprite if hit sprite fails to load', () => {
    const { rerender } = render(
      <EnemyDisplay enemy={goblin} isVisible={true} isTakingDamage={false} _useAnimate={fakeUseAnimate} />
    );

    rerender(<EnemyDisplay enemy={goblin} isVisible={true} isTakingDamage={true} _useAnimate={fakeUseAnimate} />);

    const img = screen.getByRole('img');

    fireEvent.error(img);

    expect(img.getAttribute('src')).to.equal(
      `/assets/sprites/enemies/${goblin.name.toLowerCase()}-enemy.png`
    );
  });

});

