import { assert } from 'chai';
import { Goblin } from './enemies/Goblin.js';
import { EnemyDamage, applyEnemyDamage } from './enemy_damage.js';

describe('EnemyDamage', function () {
  it('decrements the enemy current health by a damage value', function () {
    const enemy = new Goblin();
    const damage = new EnemyDamage(enemy);

    const currentHealth = damage.getDamage(6);

    assert.equal(currentHealth, 14);
    assert.equal(enemy.currentHealth, 14);
  });

  it('adds multiple damage values before applying them', function () {
    const enemy = new Goblin();

    const currentHealth = applyEnemyDamage(enemy, [2, 3, 4]);

    assert.equal(currentHealth, 11);
    assert.equal(enemy.currentHealth, 11);
  });

  it('does not reduce current health below zero', function () {
    const enemy = new Goblin();

    const currentHealth = applyEnemyDamage(enemy, 30);

    assert.equal(currentHealth, 0);
    assert.equal(enemy.currentHealth, 0);
  });

  it('rejects invalid damage values', function () {
    const enemy = new Goblin();

    assert.throws(
      () => applyEnemyDamage(enemy, -1),
      'Damage value cannot be negative.'
    );
    assert.throws(
      () => applyEnemyDamage(enemy, '5'),
      'Damage value must be a finite number.'
    );
  });
});
