import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/**
 * Test helper methods for authentication-related integration tests.
 *
 * IMPORTANT:
 * These methods are intended for **testing purposes only** and should NOT be
 * exposed in a production environment. They allow controlled setup and teardown
 * of user data to ensure deterministic and isolated test cases.
 *
 * These methods are primarily used by Mocha integration tests to:
 * - Create known user credentials before login tests
 * - Clear the database between tests to avoid state leakage
 */
Meteor.methods({

  /**
   * Creates a test user with the specified credentials.
   *
   * If a user with the same username or email already exists,
   * it will be removed before creating the new test user.
   *
   * This ensures:
   * - Tests are repeatable
   * - No duplicate key errors occur
   * - Each test starts with a clean, known user state
   *
   * @method auth.createTestUser
   *
   * @param {Object} params - Test user data
   * @param {string} params.username - Username for the test user
   * @param {string} params.email - Email for the test user
   * @param {string} params.password - Password for the test user
   * @param {Object} [params.profile={}] - Optional profile data
   *
   * @returns {string} userId - The ID of the created test user
   */
  async 'auth.createTestUser'({ username, email, password, profile = {} }) {
    const existingUser = await Meteor.users.findOneAsync({
      $or: [
        { username },
        { 'emails.address': email },
      ],
    });

    // Remove existing user to ensure clean test state
    if (existingUser) {
      await Meteor.users.removeAsync({ _id: existingUser._id });
    }

    return Accounts.createUser({
      username,
      email,
      password,
      profile,
    });
  },

  /**
   * Removes all users from the database.
   *
   * This method is used to reset the database state between tests,
   * ensuring that test cases do not interfere with each other.
   *
   * WARNING:
   * This deletes ALL users and must NEVER be used in production.
   *
   * @method auth.clearTestUsers
   *
   * @returns {number} removedCount - Number of users removed
   */
  async 'auth.clearTestUsers'() {
    return await Meteor.users.removeAsync({});
  },
});