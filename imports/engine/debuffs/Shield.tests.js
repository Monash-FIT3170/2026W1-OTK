import { assert } from 'chai';
import { Goblin } from '../enemy/enemies/Goblin';
import { Shield } from './Shield';
import { debuffRegistry } from './DebuffRegistry';

describe('Shield', function () {
  it('registers and protects any enemy with shield layers', function () {
    const enemy = new Goblin({
      health: 14,
      currentHealth: 14,
      debuffs: ['shield'],
      shieldLayers: 4,
    });

    assert.instanceOf(debuffRegistry.create('shield'), Shield);
    enemy.takeDamage(10);

    assert.equal(enemy.currentHealth, 13);
    assert.equal(enemy.shieldLayers, 4);
  });

  it('does not carry excess damage through the final shield layer', function () {
    const enemy = new Goblin({
      health: 14,
      currentHealth: 11,
      debuffs: ['shield'],
      shieldLayers: 4,
    });

    enemy.takeDamage(10);

    assert.equal(enemy.currentHealth, 10);
    enemy.takeDamage(5);
    assert.equal(enemy.currentHealth, 5);
  });

  it('ignores non-positive damage while shielded', function () {
    const enemy = new Goblin({
      health: 14,
      currentHealth: 14,
      debuffs: ['shield'],
      shieldLayers: 4,
    });

    enemy.takeDamage(0);
    enemy.takeDamage(-5);

    assert.equal(enemy.currentHealth, 14);
  });
});
