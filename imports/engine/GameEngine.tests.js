import { assert } from 'chai';
import { GameEngine } from './GameEngine';
import { FINAL_STAGE, getStageConfig } from './stages';

const USER_ID = 'stage-test-user';

function freshEngine() {
  return new GameEngine(GameEngine.newGame(USER_ID));
}

// Kills the current boss and settles the stage, exactly as game.executeCard
// does once the enemy's health hits zero.
function killBoss(engine) {
  engine.enemy.takeDamage(engine.enemy.health);
  engine.clearStage();
}

describe('GameEngine - multi-stage run', function () {
  it('starts a run on stage 1 against a debuff-free goblin', function () {
    const gameState = GameEngine.newGame(USER_ID);

    assert.equal(gameState.stage, 1);
    assert.equal(gameState.enemy.enemyId, 'goblin');
    assert.deepEqual(gameState.enemy.debuffs, []);
    assert.isFalse(gameState.enemy.timerDebuffActive);
    assert.equal(gameState.result, 'playing');
    assert.equal(gameState.scene, 'underpass-overlaid');
    assert.equal(gameState.hand.length, 5);
    assert.deepEqual(gameState.bossRecap, []);
  });

  it('parks between stages rather than ending the run', function () {
    const engine = freshEngine();
    killBoss(engine);

    assert.equal(engine.result, 'stageCleared');
    assert.equal(engine.stage, 1, 'stage only advances on the player command');
    assert.equal(engine.bossRecap.length, 1);
    assert.equal(engine.bossRecap[0].bossName, 'Goblin');
    assert.equal(engine.bossRecap[0].result, 'win');
  });

  it('advances to the stage 2 freeze boss', function () {
    const engine = freshEngine();
    killBoss(engine);
    engine.advanceStage();

    assert.equal(engine.stage, 2);
    assert.equal(engine.enemy.enemyId, 'frostwarden');
    assert.include(engine.enemy.debuffs, 'freeze');
    assert.equal(engine.result, 'playing');
    assert.equal(engine.cardsUsedThisStage, 0);
    assert.equal(engine.hand.length, 5);
    // Freeze picks its target before the opening hand is dealt, so the frozen
    // card can end up in either pile - count across both.
    assert.equal(
      [...engine.deck, ...engine.hand].filter((card) => card.isFrozen).length,
      1,
      'the freeze debuff activates on arrival'
    );
  });

  it('advances to the stage 3 timer boss', function () {
    const engine = freshEngine();
    killBoss(engine);
    engine.advanceStage();
    killBoss(engine);
    engine.advanceStage();

    assert.equal(engine.stage, 3);
    assert.equal(engine.enemy.enemyId, 'timekeeper');
    assert.include(engine.enemy.debuffs, 'timer');
    assert.isFalse(
      engine.enemy.timerDebuffActive,
      'the timer debuff stays quiet while the boss is at full health'
    );

    // Once the boss has damage to heal, the countdown arms.
    engine.enemy.takeDamage(20);
    engine.executeEnemyDebuffs();
    assert.isTrue(engine.enemy.timerDebuffActive);
  });

  it('ends the run in a win once the final stage is cleared', function () {
    const engine = freshEngine();
    for (let stage = 1; stage < FINAL_STAGE; stage++) {
      killBoss(engine);
      engine.advanceStage();
    }
    killBoss(engine);

    assert.equal(engine.stage, FINAL_STAGE);
    assert.equal(engine.result, 'win');
    assert.equal(engine.bossRecap.length, FINAL_STAGE);
    assert.deepEqual(
      engine.bossRecap.map((entry) => entry.stage),
      [1, 2, 3]
    );
  });

  it('refuses to advance while a fight is still on', function () {
    const engine = freshEngine();
    assert.throws(() => engine.advanceStage(), 'not cleared');
  });

  it('restores the locked deck for each stage, discarding mid-fight mutations', function () {
    const engine = freshEngine();
    const baseSize = engine.baseDeck.length;

    // Simulate a fight: cards get drawn, re-costed and frozen.
    engine.deck[0].currentCost = 99;
    engine.deck[1].isFrozen = true;
    engine.draw(4);

    killBoss(engine);
    engine.advanceStage();

    assert.equal(
      engine.deck.length + engine.hand.length,
      baseSize,
      'the full deck comes back'
    );
    const allCards = [...engine.deck, ...engine.hand];
    assert.isTrue(
      allCards.every((card) => card.currentCost === card.baseCost),
      'costs reset to base'
    );
    // Exactly one card is frozen, and it is the stage 2 debuff's doing rather
    // than a leftover from stage 1.
    assert.equal(allCards.filter((card) => card.isFrozen).length, 1);
    assert.equal(
      new Set(allCards.map((card) => card.uniqueId)).size,
      baseSize,
      'every card gets a distinct uniqueId'
    );
  });

  it('deals the run locked deck, not some other card list', function () {
    const engine = freshEngine();
    const baseCardIds = engine.baseDeck.map((card) => card.cardId).sort();

    killBoss(engine);
    engine.advanceStage();

    const dealtCardIds = [...engine.deck, ...engine.hand]
      .map((card) => card.cardId)
      .sort();
    assert.deepEqual(dealtCardIds, baseCardIds);
  });

  it('survives a save/load round trip between stages', function () {
    const engine = freshEngine();
    killBoss(engine);

    const restored = new GameEngine(engine.toJSON());
    assert.equal(restored.result, 'stageCleared');
    assert.equal(restored.bossRecap.length, 1);

    restored.advanceStage();
    assert.equal(restored.stage, 2);
    assert.equal(restored.enemy.enemyId, 'frostwarden');
  });

  it('keeps scene in step with the stage', function () {
    const engine = freshEngine();
    assert.equal(engine.toJSON().scene, getStageConfig(1).scene);

    killBoss(engine);
    engine.advanceStage();
    assert.equal(engine.toJSON().scene, getStageConfig(2).scene);
  });
});

describe('GameEngine - resume after time away', function () {
  function timerEngine() {
    const engine = freshEngine();
    killBoss(engine);
    engine.advanceStage();
    killBoss(engine);
    engine.advanceStage(); // stage 3: the timer boss

    // The countdown only arms once the boss has damage to heal.
    engine.enemy.takeDamage(20);
    engine.executeEnemyDebuffs();
    return engine;
  }

  it('holds the timer deadline and stage clock across an absence', function () {
    const engine = timerEngine();
    const deadlineBefore = engine.enemy.timerDebuffDeadline;
    const startedBefore = engine.stageStartedAt;

    const awayMs = 60 * 60 * 1000; // an hour with the tab closed
    engine.rebaseAfterAway(engine.lastActiveAt + awayMs);

    assert.equal(engine.enemy.timerDebuffDeadline, deadlineBefore + awayMs);
    assert.equal(engine.stageStartedAt, startedBefore + awayMs);
  });

  it('does not heal the enemy for time spent away', function () {
    const engine = timerEngine();
    engine.enemy.takeDamage(20);
    const healthBefore = engine.enemy.currentHealth;

    const returnedAt = engine.lastActiveAt + 60 * 60 * 1000;
    engine.rebaseAfterAway(returnedAt);
    engine.resolveTimerDebuff(returnedAt);

    assert.equal(engine.enemy.currentHealth, healthBefore);
    assert.isTrue(engine.enemy.timerDebuffActive);
  });

  it('still punishes idling at the battle screen', function () {
    const engine = timerEngine();
    engine.enemy.takeDamage(20);
    const healthBefore = engine.enemy.currentHealth;

    // Heartbeats keep lastActiveAt current, so a short gap is idling, not
    // absence, and must not be rebased away.
    const idledTo = engine.enemy.timerDebuffDeadline + 100;
    engine.touch(idledTo);
    engine.rebaseAfterAway(idledTo);
    engine.resolveTimerDebuff(idledTo);

    assert.equal(engine.enemy.currentHealth, healthBefore + 5);
  });

  it('leaves the clocks alone for gaps inside the heartbeat window', function () {
    const engine = timerEngine();
    const deadlineBefore = engine.enemy.timerDebuffDeadline;

    engine.rebaseAfterAway(engine.lastActiveAt + 2000);

    assert.equal(engine.enemy.timerDebuffDeadline, deadlineBefore);
  });
});
