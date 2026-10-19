import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';
import { getFinalStageFromDifficulty, SECRET_BOSS_STAGE } from '../../../engine/stages';

/**
 * Unit tests for the game.finishDialogue method and the dialogue guards on
 * the battle methods.
 *
 * Test scope:
 * - Backend-only (server-side)
 * - Direct invocation of the Meteor method handlers
 * - Persistence verified through UserDataCollection
 *
 * @see GameEngine.finishDialogue
 * @see GameEngine.finishOutro
 */
if (Meteor.isServer) {
  const userId = 'finish-dialogue-user';

  const call = (name, args = [], context = { userId }) =>
    Meteor.server.method_handlers[name].apply(context, args);

  const callFinish = (kind, context) =>
    call('game.finishDialogue', [{ kind }], context);

  const seedRun = (seenDialogue) =>
    UserDataCollection.insertAsync({
      userId,
      gameState: GameEngine.newGame(userId, null, 'hard', seenDialogue),
      ...(seenDialogue ? { seenDialogue } : {}),
    });

  // A run whose boss has just been killed, outro still pending.
  async function seedClearedStageOne() {
    const engine = new GameEngine(GameEngine.newGame(userId));
    engine.finishDialogue();
    engine.enemy.takeDamage(engine.enemy.health);
    engine.clearStage();
    await UserDataCollection.insertAsync({
      userId,
      gameState: engine.toJSON(),
    });
  }

  beforeEach(async function () {
    await UserDataCollection.removeAsync({});
  });

  describe('game.finishDialogue', function () {
    it('records the normal ending and skips it on a restarted run', async function () {
      const engine = new GameEngine(GameEngine.newGame(userId, [], 'hard'));
      engine.stage = getFinalStageFromDifficulty(engine.difficulty);
      engine.result = 'win';
      engine.finishOutro();
      await UserDataCollection.insertAsync({ userId, gameState: engine.toJSON() });
      await callFinish('ending');
      let doc = await UserDataCollection.findOneAsync({ userId });
      assert.isTrue(doc.gameState.endingSeen);
      assert.isTrue(doc.seenDialogue[`stage${getFinalStageFromDifficulty(engine.difficulty)}`].ending);
      await callFinish('ending');
      await call('game.newGame', ['hard']);
      doc = await UserDataCollection.findOneAsync({ userId });
      assert.isTrue(doc.gameState.endingSeen);
    });

    it('records an easy or medium ending under its own key, apart from the hard one', async function () {
      for (const [difficulty, final] of [['easy', 4], ['medium', 5]]) {
        await UserDataCollection.removeAsync({});
        const engine = new GameEngine(GameEngine.newGame(userId, [], difficulty));
        engine.stage = final;
        engine.result = 'win';
        engine.finishOutro();
        await UserDataCollection.insertAsync({ userId, gameState: engine.toJSON() });
        await callFinish('ending');
        const doc = await UserDataCollection.findOneAsync({ userId });
        assert.isTrue(doc.gameState.endingSeen, `${difficulty} run flag`);
        assert.isTrue(doc.seenDialogue[`${difficulty}-stage${final}`].ending);
        assert.isUndefined(doc.seenDialogue.stage6, 'hard ending untouched');
        assert.isFalse(GameEngine.newGame(userId, [], 'hard', doc.seenDialogue).endingSeen);
        assert.isTrue(GameEngine.newGame(userId, [], difficulty, doc.seenDialogue).endingSeen);
      }
    });

    it('records a mode-only intro under that mode\'s key and a shared one under the plain key', async function () {
      await UserDataCollection.insertAsync({
        userId,
        gameState: GameEngine.newGame(userId, [], 'easy'),
      });
      await callFinish('intro');
      const doc = await UserDataCollection.findOneAsync({ userId });
      assert.isTrue(doc.seenDialogue['easy-stage1'].intro, 'Easy has its own opening');
      assert.isUndefined(doc.seenDialogue.stage1);
    });

    it('rejects the ending before the outro, during battle, and on non-final stages', async function () {
      for (const [stage, result, outroSeen] of [
        [getFinalStageFromDifficulty("hard"), 'win', false],
        [getFinalStageFromDifficulty("hard"), 'playing', true],
        [1, 'win', true],
      ]) {
        await UserDataCollection.removeAsync({ userId });
        const gameState = { ...GameEngine.newGame(userId, [], "hard"), stage, result, outroSeen };
        await UserDataCollection.insertAsync({ userId, gameState });
        try {
          await callFinish('ending');
          assert.fail('Expected ending to be rejected');
        } catch (error) {
          assert.equal(error.error, 'game.finishDialogue.notPending');
        }
      }
    });

    it('records secret victory separately and preserves it on restart', async function () {
      const engine = new GameEngine(GameEngine.newGame(userId, [], 'hard'));
      engine.stage = SECRET_BOSS_STAGE;
      engine.result = 'win';
      engine.finishOutro();
      await UserDataCollection.insertAsync({ userId, gameState: engine.toJSON() });
      await callFinish('ending');
      await callFinish('ending');
      let doc = await UserDataCollection.findOneAsync({ userId });
      assert.isTrue(doc.gameState.secretEndingSeen);
      assert.isFalse(doc.gameState.endingSeen);
      assert.isTrue(doc.seenDialogue[`stage${SECRET_BOSS_STAGE}`].ending);
      assert.isUndefined(doc.seenDialogue[`stage${getFinalStageFromDifficulty(engine.difficulty)}`]);
      await call('game.newGame');
      doc = await UserDataCollection.findOneAsync({ userId });
      assert.isTrue(doc.gameState.secretEndingSeen);
      assert.isFalse(doc.gameState.endingSeen);
    });

    it('rejects unauthenticated callers', async function () {
      await seedRun();

      try {
        await callFinish('intro', {});
        assert.fail('Expected game.finishDialogue to reject a logged-out caller');
      } catch (error) {
        assert.equal(error.error, 'game.finishDialogue.notLoggedIn');
      }
    });

    it('rejects an unknown dialogue kind', async function () {
      await seedRun();

      try {
        await callFinish('epilogue');
        assert.fail('Expected a validation error');
      } catch (error) {
        assert.isOk(error);
      }
    });

    it('rejects a user with no saved run', async function () {
      try {
        await callFinish('intro');
        assert.fail('Expected game.finishDialogue to reject a missing run');
      } catch (error) {
        assert.equal(error.error, 'game.finishDialogue.noUserData');
      }
    });

    it('finishing the intro starts the fight and records it on the account', async function () {
      await seedRun();

      await callFinish('intro');

      const doc = await UserDataCollection.findOneAsync({ userId });
      assert.isTrue(doc.gameState.dialogueSeen);
      assert.isTrue(doc.seenDialogue.stage1.intro);
      assert.isUndefined(doc.seenDialogue.stage1.outro);
    });

    it('is idempotent for an intro that was already finished', async function () {
      await seedRun();
      await callFinish('intro');

      await callFinish('intro');

      const doc = await UserDataCollection.findOneAsync({ userId });
      assert.isTrue(doc.gameState.dialogueSeen);
    });

    it('rejects the intro once the stage is cleared', async function () {
      await seedClearedStageOne();

      try {
        await callFinish('intro');
        assert.fail('Expected game.finishDialogue to reject a cleared stage');
      } catch (error) {
        assert.equal(error.error, 'game.finishDialogue.notPending');
      }
    });

    it('rejects the outro while the boss is still alive', async function () {
      await seedRun();

      try {
        await callFinish('outro');
        assert.fail('Expected game.finishDialogue to reject a live fight');
      } catch (error) {
        assert.equal(error.error, 'game.finishDialogue.notPending');
      }
    });

    it('finishing the outro releases the stage-clear screen and is recorded', async function () {
      await seedClearedStageOne();

      await callFinish('outro');

      const doc = await UserDataCollection.findOneAsync({ userId });
      assert.isTrue(doc.gameState.outroSeen);
      assert.equal(doc.gameState.result, 'stageCleared');
      assert.isTrue(doc.seenDialogue.stage1.outro);
    });

    it('a restarted run skips dialogue already seen on the account', async function () {
      await seedRun();
      await callFinish('intro');

      await call('game.newGame', ['hard']);

      const doc = await UserDataCollection.findOneAsync({ userId });
      assert.isTrue(doc.gameState.dialogueSeen, 'stage 1 intro is not replayed');
      assert.isFalse(doc.gameState.outroSeen, 'stage 1 outro was never watched');
      assert.isTrue(doc.seenDialogue.stage1.intro, 'record survives a new game');
    });

    it('the next stage still shows its own intro to a first-time viewer', async function () {
      await seedClearedStageOne();
      await callFinish('outro');

      await call('game.advanceStage');

      const doc = await UserDataCollection.findOneAsync({ userId });
      assert.equal(doc.gameState.stage, 2);
      assert.isFalse(doc.gameState.dialogueSeen);
    });
  });

  describe('dialogue guards on battle methods', function () {
    it('game.executeCard is refused while the intro is pending', async function () {
      await seedRun();
      const { gameState } = await UserDataCollection.findOneAsync({ userId });

      try {
        await call('game.executeCard', [
          { uniqueCardId: gameState.hand[0].uniqueId, selectedCardIds: [] },
        ]);
        assert.fail('Expected game.executeCard to be refused');
      } catch (error) {
        assert.equal(error.error, 'game.executeCard.dialoguePending');
      }
    });

    it('game.endTurn is refused while the intro is pending', async function () {
      await seedRun();

      try {
        await call('game.endTurn');
        assert.fail('Expected game.endTurn to be refused');
      } catch (error) {
        assert.equal(error.error, 'game.endTurn.dialoguePending');
      }

      const { gameState } = await UserDataCollection.findOneAsync({ userId });
      assert.equal(gameState.result, 'playing');
    });

    it('game.applyTimerTick does nothing while the intro is pending', async function () {
      await seedRun();
      const before = await UserDataCollection.findOneAsync({ userId });

      await call('game.applyTimerTick');

      const after = await UserDataCollection.findOneAsync({ userId });
      assert.equal(after.gameState.lastActiveAt, before.gameState.lastActiveAt);
    });

    it('game.endTurn works again once the intro is finished', async function () {
      await seedRun();
      await callFinish('intro');

      await call('game.endTurn');

      const { gameState } = await UserDataCollection.findOneAsync({ userId });
      assert.equal(gameState.result, 'loss');
    });

    it('game.endTurn does not turn a cleared stage into a loss', async function () {
      await seedClearedStageOne();

      await call('game.endTurn');

      const { gameState } = await UserDataCollection.findOneAsync({ userId });
      assert.equal(gameState.result, 'stageCleared');
      assert.equal(gameState.bossRecap.length, 1);
    });
  });
}
