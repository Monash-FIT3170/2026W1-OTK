import { assert } from 'chai';
import { GameEngine } from '../GameEngine';
import { Powerup } from './Powerup';
import { powerupRegistry } from './PowerupRegistry';

class TestPowerup extends Powerup {
  constructor(data = {}) {
    super({
      powerupId: 'test-powerup',
      name: 'Test Powerup',
      description: 'Adds a fresh hand draw for testing.',
      ...data,
    });
  }

  applyTo(engine) {
    engine.draw(1);
  }
}

powerupRegistry.register('test-powerup', TestPowerup);

describe('Powerup', function () {
  it('serializes the powerup state for persistence', function () {
    const powerup = new TestPowerup({
      tier: 'rare',
      maxStacks: 2,
      currentStacks: 1,
      available: true,
    });

    assert.deepEqual(powerup.toJSON(), {
      powerupId: 'test-powerup',
      name: 'Test Powerup',
      description: 'Adds a fresh hand draw for testing.',
      tier: 'rare',
      maxStacks: 2,
      currentStacks: 1,
      available: true,
    });
  });

  it('registers and reconstructs a powerup by id', function () {
    const recreated = powerupRegistry.create({
      powerupId: 'test-powerup',
      name: 'Test Powerup',
      description: 'Adds a fresh hand draw for testing.',
      tier: 'common',
      maxStacks: 1,
      currentStacks: 0,
      available: true,
    });

    assert.instanceOf(recreated, TestPowerup);
    assert.equal(recreated.name, 'Test Powerup');
  });

  it('tracks stack count and apply behavior cleanly', function () {
    const engine = new GameEngine(GameEngine.newGame('powerup-test-user'));
    const powerup = new TestPowerup();

    assert.equal(powerup.maxStacks, 1);
    assert.equal(powerup.currentStacks, 0);
    assert.isTrue(powerup.isAvailable());

    powerup.applyTo(engine);
    assert.equal(engine.hand.length, 6);
  });
});
