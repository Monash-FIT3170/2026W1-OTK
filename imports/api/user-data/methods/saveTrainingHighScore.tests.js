import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { assert } from 'chai';
import { UserDataCollection } from '../collections/UserDataCollection';

/**
 * Unit tests for the `userData.saveTrainingHighScore` Meteor method.
 *
 * @author Hydar Rabiaa
 * @version 1.0
 */
if (Meteor.isServer) {
  describe('userData.saveTrainingHighScore', function () {
    let userId;

    beforeEach(async function () {
      await Meteor.users.removeAsync({});
      await UserDataCollection.removeAsync({});
      userId = await Accounts.createUser({
        username: 'traininghighscoretestuser',
        email: 'traininghighscoretestuser@example.com',
        password: 'secure123',
      });
      await UserDataCollection.insertAsync({ userId, gameState: {} });
    });

    it('saves a first training score', async function () {
      await Meteor.server.method_handlers['userData.saveTrainingHighScore'].apply(
        { userId },
        [120]
      );

      const userData = await UserDataCollection.findOneAsync({ userId });
      assert.equal(userData.trainingHighScore, 120);
    });

    it('overwrites a lower existing score with a new higher one', async function () {
      await UserDataCollection.updateAsync(
        { userId },
        { $set: { trainingHighScore: 100 } }
      );

      await Meteor.server.method_handlers['userData.saveTrainingHighScore'].apply(
        { userId },
        [250]
      );

      const userData = await UserDataCollection.findOneAsync({ userId });
      assert.equal(userData.trainingHighScore, 250);
    });

    it('never lowers an existing personal best', async function () {
      await UserDataCollection.updateAsync(
        { userId },
        { $set: { trainingHighScore: 500 } }
      );

      await Meteor.server.method_handlers['userData.saveTrainingHighScore'].apply(
        { userId },
        [50]
      );

      const userData = await UserDataCollection.findOneAsync({ userId });
      assert.equal(userData.trainingHighScore, 500);
    });

    it('rejects a negative damage total', async function () {
      try {
        await Meteor.server.method_handlers['userData.saveTrainingHighScore'].apply(
          { userId },
          [-10]
        );
        assert.fail('Expected a validation error');
      } catch (error) {
        assert.isOk(error);
      }
    });

    it('rejects unauthenticated calls', async function () {
      try {
        await Meteor.server.method_handlers['userData.saveTrainingHighScore'].apply(
          {},
          [100]
        );
        assert.fail('Expected notAuthorized error');
      } catch (error) {
        assert.equal(error.error, 'userData.notAuthorized');
      }
    });

    // The leaderboard (see UserDataPublications.js) reads username straight
    // off the UserDataCollection document rather than joining against
    // Meteor.users, so this method is responsible for keeping that copy
    // current.
    it('stores the player\'s username alongside a new high score', async function () {
      await Meteor.server.method_handlers['userData.saveTrainingHighScore'].apply(
        { userId },
        [120]
      );

      const userData = await UserDataCollection.findOneAsync({ userId });
      assert.equal(userData.username, 'traininghighscoretestuser');
    });

    it('keeps the stored username in sync even when the score is not a new best', async function () {
      await UserDataCollection.updateAsync(
        { userId },
        { $set: { trainingHighScore: 500, username: 'anOldUsername' } }
      );

      await Meteor.server.method_handlers['userData.saveTrainingHighScore'].apply(
        { userId },
        [50]
      );

      const userData = await UserDataCollection.findOneAsync({ userId });
      // Score is untouched (50 < 500), but the username catches up to the
      // account's current one.
      assert.equal(userData.trainingHighScore, 500);
      assert.equal(userData.username, 'traininghighscoretestuser');
    });
  });
}