import { assert } from 'chai';
import { Ninja } from '../enemy/enemies/Ninja';
import { Goblin } from '../enemy/enemies/Goblin';
import { GameEngine } from '../GameEngine';
import { Evasion } from './Evasion';
import { debuffRegistry } from './DebuffRegistry';

describe('Evasion', function () {
  it('registers and attaches idempotently', function () {
    const goblin = new Goblin();
    const evasion = new Evasion();

    evasion.applyTo(goblin);
    evasion.applyTo(goblin);

    assert.instanceOf(debuffRegistry.create('evasion'), Evasion);
    assert.deepEqual(goblin.debuffs, ['evasion']);
  });

  it('negates every third hit on any enemy carrying the debuff', function () {
    const goblin = new Goblin({ debuffs: ['evasion'] });

    goblin.takeDamage(10);
    goblin.takeDamage(10);
    assert.equal(goblin.currentHealth, 80);

    goblin.takeDamage(10);
    assert.equal(goblin.currentHealth, 80);

    goblin.takeDamage(10);
    assert.equal(goblin.currentHealth, 70);
  });

  it('attaches Evasion to new Ninjas and persists hit count across saves', function () {
    const ninja = new Ninja();

    ninja.takeDamage(10);
    ninja.takeDamage(10);

    const restored = new GameEngine({
      userId: 'evasion-test-user',
      stage: 5,
      deck: [],
      hand: [],
      enemy: ninja.toJSON(),
      result: 'playing',
    }).enemy;

    assert.deepEqual(restored.debuffs, ['evasion']);
    assert.equal(restored.damageTakenCount, 2);
    restored.takeDamage(10);
    assert.equal(restored.currentHealth, 80);
  });

  it('migrates legacy Ninja saves with attacksReceived', function () {
    const ninja = new Ninja({
      health: 100,
      currentHealth: 100,
      debuffs: [],
      attacksReceived: 2,
    });

    assert.deepEqual(ninja.debuffs, ['evasion']);
    assert.equal(ninja.damageTakenCount, 2);
    ninja.takeDamage(10);
    assert.equal(ninja.currentHealth, 100);
  });
});
