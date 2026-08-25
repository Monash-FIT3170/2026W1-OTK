import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

/**
 * Unit tests for the game.advanceStage method.
 *
 * Covers the guards around the between-stages checkpoint and confirms that
 * advancing persists the next boss, since a run must survive a quit at any
 * point.
 *
 * Test scope:
 * - Backend-only (server-side)
 * - Direct invocation of the Meteor method handler
 * - Persistence verified through UserDataCollection
 *
 * @see GameEngine.advanceStage
 */
if (Meteor.isServer) {
  const userId = 'advance-stage-user';

  const callAdvanceStage = (context = { userId }) =>
    Meteor.server.method_handlers['game.advanceStage'].apply(context, []);

  // Seeds a run sitting on the stage-clear interstitial.
  async function seedClearedStageOne() {
    const engine = new GameEngine(GameEngine.newGame(userId));
    engine.enemy.takeDamage(engine.enemy.health);
    engine.clearStage();
    await UserDataCollection.insertAsync({
      userId,
      gameState: engine.toJSON(),
    });
    return engine;
  }

  beforeEach(async function () {
    await UserDataCollection.removeAsync({});
  });

  it('Advance Stage: Rejects unauthenticated callers', async function () {
    await seedClearedStageOne();

    try {
      await callAdvanceStage({});
      assert.fail('Expected game.advanceStage to reject a logged-out caller');
    } catch (error) {
      assert.equal(error.error, 'game.advanceStage.notLoggedIn');
    }
  });

  it('Advance Stage: Rejects a user with no saved run', async function () {
    try {
      await callAdvanceStage();
      assert.fail('Expected game.advanceStage to reject a missing run');
    } catch (error) {
      assert.equal(error.error, 'game.advanceStage.noUserData');
    }
  });

  it('Advance Stage: Rejects advancing mid-fight', async function () {
    await UserDataCollection.insertAsync({
      userId,
      gameState: GameEngine.newGame(userId), // result: 'playing'
    });

    try {
      await callAdvanceStage();
      assert.fail('Expected game.advanceStage to reject an unfinished stage');
    } catch (error) {
      assert.equal(error.error, 'game.advanceStage.notBetweenStages');
    }
  });

  it('Advance Stage: Persists the next boss and a fresh deck', async function () {
    const cleared = await seedClearedStageOne();

    await callAdvanceStage();

    const { gameState } = await UserDataCollection.findOneAsync({ userId });

    assert.equal(gameState.stage, 2);
    assert.equal(gameState.enemy.enemyId, 'frostwarden');
    assert.equal(gameState.enemy.currentHealth, gameState.enemy.health);
    assert.equal(gameState.result, 'playing');
    assert.equal(gameState.hand.length, 5);
    assert.equal(
      gameState.deck.length + gameState.hand.length,
      cleared.baseDeck.length,
      'the locked deck is dealt in full'
    );
    assert.equal(
      gameState.bossRecap.length,
      1,
      'the stage 1 recap entry is carried forward'
    );
    assert.equal(gameState.cardsUsedThisStage, 0);
  });
}
