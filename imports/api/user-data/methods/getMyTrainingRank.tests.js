import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { assert } from 'chai';
import { UserDataCollection } from '../collections/UserDataCollection';

/**
 * Unit tests for the `userData.getMyTrainingRank` Meteor method.
 *
 * @author Hydar Rabiaa
 * @version 1.0
 */
if (Meteor.isServer) {
  describe('userData.getMyTrainingRank', function () {
    let userId;

    beforeEach(async function () {
      await Meteor.users.removeAsync({});
      await UserDataCollection.removeAsync({});
      userId = await Accounts.createUser({
        username: 'rankTestUser',
        email: 'ranktestuser@example.com',
        password: 'secure123',
      });
      await UserDataCollection.insertAsync({ userId, gameState: {} });
    });

    it('returns null when the player has no training score yet', async function () {
      const result = await Meteor.server.method_handlers[
        'userData.getMyTrainingRank'
      ].apply({ userId }, []);

      assert.isNull(result);
    });

    it('returns rank 1 when the player has the only score', async function () {
      await UserDataCollection.updateAsync(
        { userId },
        { $set: { trainingHighScore: 200 } }
      );

      const result = await Meteor.server.method_handlers[
        'userData.getMyTrainingRank'
      ].apply({ userId }, []);

      assert.deepEqual(result, { rank: 1, score: 200 });
    });

    it('ranks the player below others with a higher score', async function () {
      await UserDataCollection.updateAsync(
        { userId },
        { $set: { trainingHighScore: 200 } }
      );

      // Two other players with higher scores than this one.
      const otherUserIdA = await Accounts.createUser({
        username: 'otherA',
        email: 'othera@example.com',
        password: 'secure123',
      });
      await UserDataCollection.insertAsync({
        userId: otherUserIdA,
        gameState: {},
        trainingHighScore: 500,
      });

      const otherUserIdB = await Accounts.createUser({
        username: 'otherB',
        email: 'otherb@example.com',
        password: 'secure123',
      });
      await UserDataCollection.insertAsync({
        userId: otherUserIdB,
        gameState: {},
        trainingHighScore: 300,
      });

      const result = await Meteor.server.method_handlers[
        'userData.getMyTrainingRank'
      ].apply({ userId }, []);

      assert.deepEqual(result, { rank: 3, score: 200 });
    });

    it('does not count a score of exactly 0 toward anyone\'s rank', async function () {
      await UserDataCollection.updateAsync(
        { userId },
        { $set: { trainingHighScore: 50 } }
      );

      const otherUserId = await Accounts.createUser({
        username: 'zeroScoreUser',
        email: 'zeroscoreuser@example.com',
        password: 'secure123',
      });
      await UserDataCollection.insertAsync({
        userId: otherUserId,
        gameState: {},
        trainingHighScore: 0,
      });

      const result = await Meteor.server.method_handlers[
        'userData.getMyTrainingRank'
      ].apply({ userId }, []);

      assert.deepEqual(result, { rank: 1, score: 50 });
    });

    it('rejects unauthenticated calls', async function () {
      try {
        await Meteor.server.method_handlers['userData.getMyTrainingRank'].apply(
          {},
          []
        );
        assert.fail('Expected notAuthorized error');
      } catch (error) {
        assert.equal(error.error, 'userData.notAuthorized');
      }
    });
  });
}