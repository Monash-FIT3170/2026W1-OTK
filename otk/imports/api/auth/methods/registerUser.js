import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

/**
 * Registers a new user in the system.
 *
 * This method validates the provided credentials and creates a new user
 * using Meteor's Accounts system. The created user will be stored in the
 * `Meteor.users` collection and can subsequently authenticate using
 * `Meteor.loginWithPassword`.
 *
 * Validation Rules:
 * - Username must be a string with a minimum length of 3 characters
 * - Email must be a valid string (format not strictly validated here)
 * - Password must be a string with a minimum length of 6 characters
 *
 * @method auth.registerUser
 *
 * @param {Object} params - The user registration data
 * @param {string} params.username - Desired username (min 3 characters)
 * @param {string} params.email - User email address
 * @param {string} params.password - User password (min 6 characters)
 *
 * @returns {string} userId - The ID of the newly created user
 *
 * @throws {Meteor.Error} auth.invalidUsername
 * Thrown when the username is shorter than 3 characters
 *
 * @throws {Meteor.Error} auth.invalidPassword
 * Thrown when the password is shorter than 6 characters
 *
 * @throws {Meteor.Error}
 * May also throw errors from `Accounts.createUser`, such as:
 * - duplicate username
 * - duplicate email
 */
Meteor.methods({
  'auth.registerUser'({ username, email, password }) {
    check(username, String);
    check(email, String);
    check(password, String);

    if (username.trim().length < 3) {
      throw new Meteor.Error(
        'auth.invalidUsername',
        'Username must be at least 3 characters.'
      );
    }

    if (password.length < 6) {
      throw new Meteor.Error(
        'auth.invalidPassword',
        'Password must be at least 6 characters.'
      );
    }

    return Accounts.createUser({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      profile: {
        createdAt: new Date(),
      },
    });
  },
});