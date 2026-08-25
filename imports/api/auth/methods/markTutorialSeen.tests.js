import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { assert } from 'chai';

/**
 * Unit tests for the `user.markTutorialSeen` Meteor method.
 *
 * @author Hydar Rabiaa
 * @version 1.0
 */
if (Meteor.isServer) {
  describe('user.markTutorialSeen', function () {
    let userId;

    beforeEach(async function () {
      await Meteor.users.removeAsync({});
      userId = await Accounts.createUser({
        username: 'tutorialtestuser',
        email: 'tutorialtestuser@example.com',
        password: 'secure123',
      });
    });

    it('sets profile.hasSeenTutorial to true for the logged-in user', async function () {
      await Meteor.server.method_handlers['user.markTutorialSeen'].apply(
        { userId },
        []
      );

      const user = await Meteor.users.findOneAsync({ _id: userId });
      assert.isTrue(user.profile.hasSeenTutorial);
    });

    it('rejects unauthenticated calls', async function () {
      try {
        await Meteor.server.method_handlers['user.markTutorialSeen'].apply(
          {},
          []
        );
        assert.fail('Expected notLoggedIn error');
      } catch (error) {
        assert.equal(error.error, 'user.markTutorialSeen.notLoggedIn');
      }
    });
  });
}