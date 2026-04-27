import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';

/**
 * Unit tests for the `auth.registerUser` Meteor method.
 *
 * These tests validate:
 * - Input validation (username and password constraints)
 * - Successful user creation
 * - Correct persistence of user data in the database
 *
 * Test Scope:
 * - Backend-only (server-side)
 * - Direct invocation of Meteor method handlers
 * - No client interaction or login flow
 *
 * Each test runs in isolation by clearing the `Meteor.users`
 * collection before execution to ensure no shared state.
 */
if (Meteor.isServer) {
  describe('auth.registerUser', function () {

    /**
     * A valid user object used across multiple test cases.
     */
    const validUser = {
      username: 'testuser1',
      email: 'testuser1@example.com',
      password: 'secure123',
    };

    /**
     * Reset database before each test to ensure isolation.
     */
    beforeEach(async function () {
      await Meteor.users.removeAsync({});
    });

    /**
     * Test: Valid username should be accepted.
     *
     * Verifies that:
     * - A user is successfully created when a valid username is provided
     * - The stored username matches the input
     */
    it('accepts a correct username', async function () {
      const userId = await Meteor.server.method_handlers['auth.registerUser'].apply(
        {},
        [validUser]
      );

      const user = await Meteor.users.findOneAsync({ _id: userId });

      assert.exists(user);
      assert.equal(user.username, validUser.username);
    });

    /**
     * Test: Invalid username should be rejected.
     *
     * Verifies that:
     * - A username shorter than 3 characters is rejected
     * - The correct Meteor error code is thrown
     */
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

    /**
     * Test: Valid password should be accepted.
     *
     * Verifies that:
     * - A user is created successfully when password meets requirements
     */
    it('accepts a correct password', async function () {
      const userId = await Meteor.server.method_handlers['auth.registerUser'].apply(
        {},
        [validUser]
      );

      const user = await Meteor.users.findOneAsync({ _id: userId });

      assert.exists(user);
      assert.equal(user._id, userId);
    });

    /**
     * Test: Invalid password should be rejected.
     *
     * Verifies that:
     * - A password shorter than 6 characters is rejected
     * - The correct Meteor error code is thrown
     */
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

    /**
     * Test: User is correctly stored in the database.
     *
     * Verifies that:
     * - A user document is created in `Meteor.users`
     * - Username and email fields are correctly stored
     */
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
  });
}