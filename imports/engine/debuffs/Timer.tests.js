import { assert } from 'chai';
import { DeckBuilder } from '../DeckBuilder';
import { GameEngine } from '../GameEngine';
import { Goblin } from '../enemy/enemies/Goblin';
import { debuffRegistry } from './DebuffRegistry';
import { Timer } from './Timer';

function buildEngine() {
  return new GameEngine({
    userId: 'timer-test-user',
    stage: 1,
    deck: DeckBuilder.buildStartingDeck(),
    hand: [],
    enemy: new Goblin().toJSON(),
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

  it('increases enemy health after the deadline passes', function () {
    const engine = buildEngine();
    new Timer().activateDebuff(engine);

    const originalHealth = engine.enemy.currentHealth;
    const fakeNow = engine.enemy.timerDebuffDeadline + 100;

    engine.resolveTimerDebuff(fakeNow);

    assert.equal(engine.enemy.currentHealth, originalHealth + 5);
    assert.isAbove(engine.enemy.timerDebuffDeadline, fakeNow);
  });

  it('clears the timer debuff when the player plays a card', function () {
    const engine = buildEngine();
    new Timer().activateDebuff(engine);

    const firstCard = engine.deck[0];
    engine.hand.push(firstCard);

    engine.executeCard(firstCard.uniqueId);

    assert.isFalse(engine.enemy.timerDebuffActive);
    assert.isNull(engine.enemy.timerDebuffDeadline);
  });
});
