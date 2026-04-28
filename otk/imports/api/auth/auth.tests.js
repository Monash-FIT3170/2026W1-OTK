import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';

if (Meteor.isServer) {
  describe('auth.registerUser', function () {
    const validUser = {
      username: 'testuser1',
      email: 'testuser1@example.com',
      password: 'secure123',
    };

    beforeEach(async function () {
      await Meteor.users.removeAsync({});
    });

    it('accepts a correct username', async function () {
      const userId = await Meteor.server.method_handlers['auth.registerUser'].apply(
        {},
        [validUser]
      );

      const user = await Meteor.users.findOneAsync({ _id: userId });

      assert.exists(user);
      assert.equal(user.username, validUser.username);
    });

    it('rejects an incorrect username', async function () {
      const invalidUser = {
        username: 'ab',
        email: 'badusername@example.com',
        password: 'secure123',
      };

      try {
        await Meteor.server.method_handlers['auth.registerUser'].apply({}, [invalidUser]);
        assert.fail('Expected invalid username error');
      } catch (error) {
        assert.equal(error.error, 'auth.invalidUsername');
      }
    });

    it('accepts a correct password', async function () {
      const userId = await Meteor.server.method_handlers['auth.registerUser'].apply(
        {},
        [validUser]
      );

      const user = await Meteor.users.findOneAsync({ _id: userId });

      assert.exists(user);
      assert.equal(user._id, userId);
    });

    it('rejects an incorrect password', async function () {
      const invalidUser = {
        username: 'validuser',
        email: 'badpassword@example.com',
        password: '123',
      };

      try {
        await Meteor.server.method_handlers['auth.registerUser'].apply({}, [invalidUser]);
        assert.fail('Expected invalid password error');
      } catch (error) {
        assert.equal(error.error, 'auth.invalidPassword');
      }
    });

    it('stores the user in the database', async function () {
      const userId = await Meteor.server.method_handlers['auth.registerUser'].apply(
        {},
        [validUser]
      );

      const user = await Meteor.users.findOneAsync({ _id: userId });

      assert.exists(user);
      assert.equal(user.username, validUser.username);
      assert.equal(user.emails[0].address, validUser.email);
    });

    it('rejects an existing username', async function () {
      const invalidUser = {
        username: 'testuser1',
        email: 'testuserunique@example.com',
        password: 'secure123',
      }

      try {
        await Meteor.server.method_handlers['auth.registerUser'].apply({}, [validUser]);
        await Meteor.server.method_handlers['auth.registerUser'].apply({}, [invalidUser]);
        assert.fail('Expected existing username error');
      } catch (error) {
        assert.equal(error.error, 'auth.usernameTaken');
      }
    });

    it('rejects an existing email', async function () {
      const invalidUser = {
        username: 'testUserUnique',
        email: 'testuser1@example.com',
        password: 'secure123',
      };

      try {
        await Meteor.server.method_handlers['auth.registerUser'].apply({}, [validUser]);
        await Meteor.server.method_handlers['auth.registerUser'].apply({}, [invalidUser]);
        assert.fail('Expected existing email error');
      } catch (error) {
        assert.equal(error.error, 'auth.emailTaken');
      }
    });
  });
}