import { assert } from 'chai';
import { DeckBuilder } from '../DeckBuilder';
import { GameEngine } from '../GameEngine';
import { Timekeeper } from '../enemy/enemies/Timekeeper';
import { debuffRegistry } from './DebuffRegistry';
import { Timer } from './Timer';

function buildEngine() {
  return new GameEngine({
    userId: 'timer-test-user',
    stage: 3,
    deck: DeckBuilder.buildStartingDeck(),
    hand: [],
    enemy: new Timekeeper().toJSON(),
    scene: 'underpass-overlaid',
    result: 'playing',
  });
}

describe('Timer', function () {
  it('registers itself and can be reconstructed by id', function () {
    assert.instanceOf(debuffRegistry.create('timer'), Timer);
  });

  it('activates timer state on an enemy', function () {
    const engine = buildEngine();
    assert.isFalse(engine.enemy.timerDebuffActive);

    new Timer().activateDebuff(engine);

    assert.isTrue(engine.enemy.timerDebuffActive);
    assert.isNumber(engine.enemy.timerDebuffDeadline);
    assert.equal(engine.enemy.timerDebuffInterval, 5000);
    assert.equal(engine.enemy.timerDebuffTickAmount, 5);
  });

  it('heals the enemy once after the deadline passes, then goes quiet', function () {
    const engine = buildEngine();
    // The heal is capped at max health, so the enemy must be hurt first for
    // the tick to be observable.
    engine.enemy.takeDamage(20);
    new Timer().activateDebuff(engine);

    const originalHealth = engine.enemy.currentHealth;
    const fakeNow = engine.enemy.timerDebuffDeadline + 100;

    engine.resolveTimerDebuff(fakeNow);

    assert.equal(engine.enemy.currentHealth, originalHealth + 5);
    // Grace-period design: the heal fires once and the clock stops until the
    // player plays a card and rearms it.
    assert.isFalse(engine.enemy.timerDebuffActive);
    assert.isNull(engine.enemy.timerDebuffDeadline);
  });

  it('never heals the enemy above its maximum health', function () {
    const engine = buildEngine();
    new Timer().activateDebuff(engine);

    engine.resolveTimerDebuff(engine.enemy.timerDebuffDeadline + 100);

    assert.equal(engine.enemy.currentHealth, engine.enemy.health);
  });

  it('restarts a fresh grace period when the player plays a card', function () {
    const engine = buildEngine();
    new Timer().activateDebuff(engine);

    const firstCard = engine.deck[0];
    engine.hand.push(firstCard);
    const before = Date.now();

    engine.executeCard(firstCard.uniqueId);

    // executeCard clears the running deadline, then executeEnemyDebuffs lets
    // Timer.executeDebuff arm a new one.
    assert.isTrue(engine.enemy.timerDebuffActive);
    assert.isAtLeast(
      engine.enemy.timerDebuffDeadline,
      before + engine.enemy.timerDebuffInterval
    );
  });
});
