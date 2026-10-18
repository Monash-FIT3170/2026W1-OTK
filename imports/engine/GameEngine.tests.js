import { assert } from 'chai';
import { GameEngine } from './GameEngine';
import { SECRET_BOSS_STAGE, STAGES, getStageConfig, getFinalStageFromDifficulty, getStageDialogue, dialogueKey, shouldShowDialogue } from './stages';
import { getEnding, EASY_ENDING, MEDIUM_ENDING, NORMAL_ENDING, SECRET_ENDING, HARD_MODE_TEASER } from './endings';
import { Shield } from './debuffs';
import { powerUpRegistry } from './powerups';

const USER_ID = 'stage-test-user';

function freshEngine(difficulty) {
  return new GameEngine(GameEngine.newGame(USER_ID, undefined, difficulty ?? 'hard'));
}

// Kills the current boss and settles the stage, exactly as game.executeCard
// does once the enemy's health hits zero.
function killBoss(engine) {
  while (engine.enemy.currentHealth > 0) {
    engine.enemy.takeDamage(engine.enemy.health);
  }
  engine.clearStage();
}

function advanceTo(engine, stage) {
  while (engine.stage < stage) {
    killBoss(engine);
    engine.advanceStage();
  }
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

  it('ignores a second clearStage on the same corpse', function () {
    const engine = freshEngine();
    killBoss(engine);
    // A card dragged during the death-animation window fires another
    // executeCard -> clearStage on the already-dead boss.
    engine.clearStage();

    assert.equal(engine.bossRecap.length, 1, 'boss recorded exactly once');
  });

  it('advances to the stage 2 Frostwarden boss', function () {
    const engine = freshEngine();
    killBoss(engine);
    engine.advanceStage();

    assert.equal(engine.stage, 2);
    assert.equal(engine.enemy.enemyId, 'frostwarden');
    assert.deepEqual(engine.enemy.debuffs, ['freeze']);
    assert.equal(engine.result, 'playing');
    assert.equal(engine.cardsUsedThisStage, 0);
    assert.equal(engine.hand.length, 5);
    assert.equal(engine.enemy.damageTakenCount, 0);
  });

  it('advances to the stage 3 Undying boss', function () {
    const engine = freshEngine();
    advanceTo(engine, 3);

    assert.equal(engine.stage, 3);
    assert.equal(engine.enemy.enemyId, 'undying');
    assert.deepEqual(engine.enemy.debuffs, ['shield']);
  });

  it('advances to the stage 4 timer boss', function () {
    const engine = freshEngine();
    advanceTo(engine, 4);

    assert.equal(engine.stage, 4);
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

  it('advances to the stage 5 ninja boss', function () {
    const engine = freshEngine();
    advanceTo(engine, 5);

    assert.equal(engine.stage, 5);
    assert.equal(engine.enemy.enemyId, 'ninja');
    assert.deepEqual(engine.enemy.debuffs, ['evasion']);
  });

  it('advances to the stage 6 inflation boss', function () {
    const engine = freshEngine();
    advanceTo(engine, 6);

    assert.equal(engine.stage, 6);
    assert.equal(engine.stage, getFinalStageFromDifficulty('hard'));
    assert.equal(engine.enemy.enemyId, 'merchant');
    assert.include(engine.enemy.debuffs, 'inflation');
  });

  it('final stage is 4 for easy difficulty', function () {
    const difficulty = 'easy';

    const engine = freshEngine(difficulty);
    for (let stage = 1; stage < getFinalStageFromDifficulty(difficulty); stage++) {
      killBoss(engine);
      engine.advanceStage();
    }

    killBoss(engine);

    assert.equal(engine.stage, 4);
    assert.deepEqual(
      engine.bossRecap.map((entry) => entry.stage),
      STAGES.slice(0, 4).map((entry) => entry.stage)
    );
  });

  it('final stage is 5 for medium difficulty', function () {
    const difficulty = 'medium';

    const engine = freshEngine(difficulty);
    for (let stage = 1; stage < getFinalStageFromDifficulty(difficulty); stage++) {
      killBoss(engine);
      engine.advanceStage();
    }

    killBoss(engine);

    assert.equal(engine.stage, 5);
    assert.deepEqual(
      engine.bossRecap.map((entry) => entry.stage),
      STAGES.slice(0, 5).map((entry) => entry.stage)
    );
  });

  it('ends the run in a win once the final stage is cleared and not advancing to the secret boss', function () {
    const difficulty = 'hard';

    const engine = freshEngine(difficulty);
    for (let stage = 1; stage < getFinalStageFromDifficulty(difficulty); stage++) {
      killBoss(engine);
      engine.bossRecap[stage - 1].powerUpsUsed = 1;
      engine.advanceStage();
    }
    killBoss(engine);

    assert.equal(engine.stage, getFinalStageFromDifficulty(difficulty));
    assert.equal(engine.result, 'win');
    assert.equal(engine.bossRecap.length, getFinalStageFromDifficulty(difficulty));
    assert.deepEqual(
      engine.bossRecap.map((entry) => entry.stage),
      STAGES.slice(0, -1).map((entry) => entry.stage)
    );
  });

  it('advances to the stage 7 secret boss', function () {
    const engine = freshEngine();
    for (let stage = 1; stage < SECRET_BOSS_STAGE; stage++) {
      killBoss(engine);
      engine.advanceStage();
    }
    killBoss(engine);

    assert.equal(engine.stage, 7);
    assert.equal(engine.stage, SECRET_BOSS_STAGE);
    assert.equal(engine.enemy.enemyId, 'secretboss');
    assert.equal(engine.enemy.debuffs, engine.debuffsFaced);
    assert.deepEqual(
      engine.bossRecap.map((entry) => entry.stage),
      STAGES.map((entry) => entry.stage)
    );
  });

  it('keeps the secret boss debuffs through a Restart Stage', function () {
    const engine = freshEngine();
    advanceTo(engine, SECRET_BOSS_STAGE);
    engine.powerUps.push(powerUpRegistry.create('restart-stage'));

    engine.usePowerUp(engine.powerUps.length - 1);

    assert.equal(engine.enemy.enemyId, 'secretboss');
    assert.sameMembers(engine.enemy.debuffs, engine.debuffsFaced);
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

    while (engine.stage < 2) {
      killBoss(engine);
      engine.advanceStage();
    }

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
    // Exactly one card is frozen by Frostwarden at stage 2, not left over
    // from an earlier stage.
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
    advanceTo(engine, 4);

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

describe('GameEngine - boss dialogue', function () {
  const seenAll = () => ({
    stage1: { intro: true, outro: true },
    stage2: { intro: true, outro: true },
  });

  it('starts a fresh account on stage 1 with the intro and outro pending', function () {
    const engine = freshEngine();

    assert.isFalse(engine.dialogueSeen);
    assert.isFalse(engine.outroSeen);
    assert.isTrue(engine.isIntroPending());
    assert.isFalse(engine.isOutroPending(), 'the boss is still alive');
  });

  it('skips dialogue the account has already seen when a run starts', function () {
    const engine = new GameEngine(GameEngine.newGame(USER_ID, null, "hard", seenAll()));

    assert.isTrue(engine.dialogueSeen);
    assert.isTrue(engine.outroSeen);
    assert.isFalse(engine.isIntroPending());
  });

  it('only skips the stages that have been seen', function () {
    const seen = { stage1: { intro: true, outro: true } };
    const engine = new GameEngine(GameEngine.newGame(USER_ID, null, "hard", seen));
    killBoss(engine);

    engine.advanceStage(seen);

    assert.equal(engine.stage, 2);
    assert.isFalse(engine.dialogueSeen, 'stage 2 intro is new to this account');
    assert.isFalse(engine.outroSeen);
  });

  it('treats an intro seen without its outro as half-seen', function () {
    const engine = new GameEngine(
      GameEngine.newGame(USER_ID, null, "hard", { stage1: { intro: true } })
    );

    assert.isTrue(engine.dialogueSeen);
    assert.isFalse(engine.outroSeen);
  });

  it('puts the next stage back into an intro-pending state', function () {
    const engine = new GameEngine(GameEngine.newGame(USER_ID, null, "hard", seenAll()));
    killBoss(engine);

    engine.advanceStage({});

    assert.isTrue(engine.isIntroPending());
    assert.isFalse(engine.outroSeen);
  });

  it('flags the outro as pending once the boss is cleared', function () {
    const engine = freshEngine();
    engine.finishDialogue();
    killBoss(engine);

    assert.equal(engine.result, 'stageCleared');
    assert.isTrue(engine.isOutroPending());

    engine.finishOutro();

    assert.isFalse(engine.isOutroPending());
  });

  it('does not report an outro as pending after a loss', function () {
    const engine = freshEngine();
    engine.result = 'loss';

    assert.isFalse(engine.isOutroPending());
  });

  it('starts the stage clock only when the intro finishes', function () {
    const engine = freshEngine();
    engine.stageStartedAt = 1000;

    engine.finishDialogue(9000);

    assert.isTrue(engine.dialogueSeen);
    assert.equal(engine.stageStartedAt, 9000);
  });

  it('never has a timer countdown running when the fight begins', function () {
    const engine = freshEngine();
    engine.enemy.timerDebuffActive = true;
    engine.enemy.timerDebuffDeadline = 12345;

    engine.finishDialogue();

    assert.isFalse(engine.enemy.timerDebuffActive);
    assert.isNull(engine.enemy.timerDebuffDeadline);
  });

  it('round-trips both dialogue flags through toJSON', function () {
    const engine = freshEngine();
    engine.finishDialogue();

    const restored = new GameEngine(engine.toJSON());

    assert.isTrue(restored.dialogueSeen);
    assert.isFalse(restored.outroSeen);
  });

  it('treats saves from before dialogue existed as already seen', function () {
    const legacy = GameEngine.newGame(USER_ID);
    delete legacy.dialogueSeen;
    delete legacy.outroSeen;

    const engine = new GameEngine(legacy);

    assert.isFalse(engine.isIntroPending());
    assert.isTrue(engine.outroSeen);
  });

  it('gives each stage dialogue, with the secret outro handled by its ending', function () {
    STAGES.forEach(({ stage, dialogue }) => {
      assert.isAbove(dialogue.intro.length, 0, `stage ${stage} intro`);
      if (stage === SECRET_BOSS_STAGE) {
        assert.lengthOf(dialogue.outro, 0, 'secret ending includes the defeat dialogue');
      } else {
        assert.isAbove(dialogue.outro.length, 0, `stage ${stage} outro`);
      }
      [...dialogue.intro, ...dialogue.outro].forEach((line) => {
        assert.oneOf(line.speaker, ['player', 'enemy', 'narrator']);
        assert.isNotEmpty(line.text);
      });
    });
  });
});

describe('GameEngine - normal ending', function () {
  it('waits for normal victory and the final boss outro', function () {
    const engine = freshEngine();
    engine.stage = getFinalStageFromDifficulty(engine.difficulty);
    engine.result = 'playing';
    assert.isFalse(engine.isEndingPending());
    engine.result = 'stageCleared';
    assert.isFalse(engine.isEndingPending(), 'secret route continues to another fight');
    engine.result = 'win';
    assert.isFalse(engine.isEndingPending(), 'boss outro comes first');
    engine.finishOutro();
    assert.isTrue(engine.isEndingPending());
    engine.finishEnding();
    assert.isFalse(engine.isEndingPending());
    assert.isTrue(new GameEngine(engine.toJSON()).endingSeen);
  });

  it('does not play an ending after a loss', function () {
    const engine = freshEngine();
    engine.finishOutro();
    engine.stage = getFinalStageFromDifficulty(engine.difficulty);
    engine.result = 'loss';
    assert.isFalse(engine.isEndingPending());
  });

  it('tracks the ending separately from previously watched boss dialogue', function () {
    const engine = new GameEngine(GameEngine.newGame(USER_ID, null, "hard", {
      [`stage${getFinalStageFromDifficulty("hard")}`]: { outro: true },
    }));
    assert.isFalse(engine.endingSeen);
    const watched = new GameEngine(GameEngine.newGame(USER_ID, null, "hard", {
      [`stage${getFinalStageFromDifficulty("hard")}`]: { ending: true },
    }));
    assert.isTrue(watched.endingSeen);
  });
});

describe('GameEngine - secret ending', function () {
  it('plays after secret victory even when the normal ending was watched', function () {
    const engine = new GameEngine(GameEngine.newGame(USER_ID, null, "hard", {
      [`stage${getFinalStageFromDifficulty("hard")}`]: { ending: true },
    }));
    engine.stage = SECRET_BOSS_STAGE;
    engine.outroSeen = true;
    engine.result = 'playing';
    assert.isFalse(engine.isEndingPending());
    engine.result = 'win';
    assert.isTrue(engine.isEndingPending());
    engine.finishEnding();
    assert.isFalse(engine.isEndingPending());
    assert.isTrue(new GameEngine(engine.toJSON()).secretEndingSeen);
  });

  it('skips a watched secret ending without skipping an unseen normal ending', function () {
    const engine = new GameEngine(GameEngine.newGame(USER_ID, null, "hard", {
      [`stage${SECRET_BOSS_STAGE}`]: { ending: true },
    }));
    assert.isTrue(engine.secretEndingSeen);
    assert.isFalse(engine.endingSeen);
    engine.stage = SECRET_BOSS_STAGE;
    engine.outroSeen = true;
    engine.result = 'win';
    assert.isFalse(engine.isEndingPending());
    engine.stage = getFinalStageFromDifficulty("hard");
    assert.isTrue(engine.isEndingPending());
  });
});

describe('GameEngine - difficulty dialogue', function () {
  const texts = (lines) => lines.map((line) => line.text);

  // Plays a whole run for a difficulty without using any power-up.
  function playToEnd(difficulty) {
    const engine = freshEngine(difficulty);
    for (let guard = 0; guard < 10 && engine.result !== 'win'; guard++) {
      killBoss(engine);
      if (engine.result === 'stageCleared') engine.advanceStage();
    }
    return engine;
  }

  it('ends each difficulty on its own final boss, with Hard alone reaching the secret boss', function () {
    const easy = playToEnd('easy');
    assert.deepEqual([easy.stage, easy.enemy.enemyId], [4, 'timekeeper']);
    const medium = playToEnd('medium');
    assert.deepEqual([medium.stage, medium.enemy.enemyId], [5, 'ninja']);
    assert.equal(playToEnd('hard').stage, SECRET_BOSS_STAGE);
  });

  it('plays each mode\'s own ending after its final boss outro', function () {
    [['easy', 4], ['medium', 5], ['hard', 6]].forEach(([difficulty, final]) => {
      const engine = freshEngine(difficulty);
      engine.stage = final - 1;
      engine.result = 'win';
      engine.outroSeen = true;
      assert.isFalse(engine.isEndingPending(), `${difficulty} stage ${final - 1}`);
      engine.stage = final;
      assert.isTrue(engine.isEndingPending(), `${difficulty} stage ${final}`);
      engine.finishEnding();
      assert.isFalse(engine.isEndingPending());
    });
  });

  it('opens with the right Chronoshard count for each mode', function () {
    const opening = (difficulty) => texts(getStageDialogue(1, 'intro', difficulty));
    assert.include(opening('easy'), 'Four pieces.');
    assert.include(opening('medium'), 'Five pieces.');
    assert.include(opening('hard'), 'Six pieces.');
    assert.notInclude(opening('easy'), 'Six pieces.');
    // Everything except those two lines is shared.
    const strip = (lines) => lines.filter((text) => !/ fragments of | pieces\.$/.test(text));
    assert.deepEqual(strip(opening('easy')), strip(opening('hard')));
    assert.deepEqual(strip(opening('medium')), strip(opening('hard')));
  });

  it('gives Easy\'s Timekeeper the power warning the Merchant would have delivered', function () {
    assert.include(texts(getStageDialogue(4, 'outro', 'easy')), 'Nothing the Clock gives is free.');
    assert.notInclude(texts(getStageDialogue(4, 'outro', 'medium')), 'Nothing the Clock gives is free.');
    assert.notInclude(texts(getStageDialogue(4, 'outro', 'hard')), 'Nothing the Clock gives is free.');
  });

  it('stops Medium\'s Ninja pointing at a Merchant who is never fought', function () {
    assert.isTrue(texts(getStageDialogue(5, 'outro', 'hard')).some((text) => /Merchant/.test(text)));
    assert.isFalse(texts(getStageDialogue(5, 'outro', 'medium')).some((text) => /Merchant/.test(text)));
    assert.isAbove(getStageDialogue(5, 'outro', 'medium').length, 0);
  });

  it('leaves every Hard script exactly as it is for the other modes to fall back on', function () {
    STAGES.forEach((stage) => {
      assert.strictEqual(getStageDialogue(stage.stage, 'intro', 'hard'), stage.dialogue.intro);
      assert.strictEqual(getStageDialogue(stage.stage, 'outro', undefined), stage.dialogue.outro);
    });
    // A stage with no override reuses Hard's lines in Easy and Medium.
    assert.strictEqual(getStageDialogue(2, 'intro', 'easy'), getStageConfig(2).dialogue.intro);
    assert.strictEqual(getStageDialogue(3, 'outro', 'medium'), getStageConfig(3).dialogue.outro);
  });

  it('keeps shared scripts on the plain key and mode-only scripts on their own', function () {
    assert.equal(dialogueKey(1, 'intro', 'hard'), 'stage1');
    assert.equal(dialogueKey(1, 'intro', 'easy'), 'easy-stage1');
    assert.equal(dialogueKey(1, 'outro', 'easy'), 'stage1', 'Goblin outro is shared');
    assert.equal(dialogueKey(4, 'outro', 'easy'), 'easy-stage4');
    assert.equal(dialogueKey(4, 'intro', 'easy'), 'stage4', 'Timekeeper intro is shared');
    assert.equal(dialogueKey(5, 'outro', 'medium'), 'medium-stage5');
    assert.equal(dialogueKey(6, 'ending', 'hard'), 'stage6');
    assert.equal(dialogueKey(4, 'ending', 'easy'), 'easy-stage4');
    assert.equal(dialogueKey(5, 'ending', 'medium'), 'medium-stage5');
    assert.equal(dialogueKey(3), 'stage3');
  });

  it('does not let watching Hard hide a mode-only script, but does skip shared ones', function () {
    const seenHard = { stage1: { intro: true, outro: true }, stage2: { intro: true, outro: true } };
    assert.isTrue(shouldShowDialogue(1, 'intro', seenHard, 'easy'), 'Easy has its own opening');
    assert.isFalse(shouldShowDialogue(1, 'outro', seenHard, 'easy'), 'shared outro already seen');
    assert.isFalse(shouldShowDialogue(2, 'intro', seenHard, 'easy'), 'shared stage already seen');
    assert.isFalse(shouldShowDialogue(1, 'intro', { 'easy-stage1': { intro: true } }, 'easy'));
    assert.isTrue(shouldShowDialogue(1, 'intro', { 'easy-stage1': { intro: true } }, 'medium'));
  });

  it('starts an Easy run with its own opening even after Hard was watched', function () {
    const seen = { stage1: { intro: true, outro: true } };
    assert.isTrue(new GameEngine(GameEngine.newGame(USER_ID, null, 'easy', seen)).isIntroPending());
    assert.isFalse(new GameEngine(GameEngine.newGame(USER_ID, null, 'hard', seen)).isIntroPending());
  });

  it('tracks each mode\'s ending separately in the account record', function () {
    const seen = { 'easy-stage4': { ending: true } };
    assert.isTrue(new GameEngine(GameEngine.newGame(USER_ID, null, 'easy', seen)).endingSeen);
    assert.isFalse(new GameEngine(GameEngine.newGame(USER_ID, null, 'medium', seen)).endingSeen);
    assert.isFalse(new GameEngine(GameEngine.newGame(USER_ID, null, 'hard', seen)).endingSeen);
    assert.isTrue(
      new GameEngine(GameEngine.newGame(USER_ID, null, 'hard', { stage6: { ending: true } })).endingSeen
    );
  });

  describe('endings', function () {
    it('picks the script by difficulty, and the secret ending always wins', function () {
      assert.strictEqual(getEnding('easy'), EASY_ENDING);
      assert.strictEqual(getEnding('medium'), MEDIUM_ENDING);
      assert.strictEqual(getEnding('hard'), NORMAL_ENDING);
      assert.strictEqual(getEnding('hard', true), SECRET_ENDING);
    });

    it('uses the right shard numbers for each mode', function () {
      const easy = texts(EASY_ENDING);
      assert.include(easy, 'Four Chronoshards.');
      assert.include(easy, 'There must be… five.');
      assert.include(easy, 'There were four Guardians.');
      assert.include(easy, 'FIFTH CHRONOSHARD DETECTED.');
      assert.include(easy, 'Five pieces became one.');
      assert.include(easy, 'Thank you… and forgive me.');
      const medium = texts(MEDIUM_ENDING);
      assert.include(medium, 'Five Chronoshards.');
      assert.include(medium, 'There must be… six.');
      assert.include(medium, 'There were five Guardians.');
      assert.include(medium, 'SIXTH CHRONOSHARD DETECTED.');
      assert.include(medium, 'Six pieces became one.');
      [easy, medium].forEach((lines) => {
        assert.notInclude(lines, 'SEVENTH CHRONOSHARD DETECTED.');
        assert.isFalse(lines.some((text) => /seven/i.test(text)));
      });
    });

    it('lets Easy\'s Timekeeper speak straight after his defeat but Medium\'s return as an echo', function () {
      assert.include(texts(EASY_ENDING), 'The Timekeeper struggles to speak.');
      assert.notInclude(texts(EASY_ENDING), 'Huh?!? Who is that?');
      assert.include(texts(MEDIUM_ENDING), 'The Timekeeper. What remains of him.');
    });

    it('adds the Hard-mode teaser only to Easy and Medium runs that used no power-ups', function () {
      assert.deepEqual(getEnding('easy', false, true), [...EASY_ENDING, ...HARD_MODE_TEASER]);
      assert.deepEqual(getEnding('medium', false, true), [...MEDIUM_ENDING, ...HARD_MODE_TEASER]);
      assert.strictEqual(getEnding('easy', false, false), EASY_ENDING);
      assert.strictEqual(getEnding('hard', false, true), NORMAL_ENDING, 'Hard has the secret boss instead');
    });

    it('uses only valid speakers', function () {
      [EASY_ENDING, MEDIUM_ENDING, HARD_MODE_TEASER].flat().forEach((line) => {
        assert.oneOf(line.speaker, ['player', 'enemy', 'narrator']);
        assert.isNotEmpty(line.text);
      });
    });
  });
});
