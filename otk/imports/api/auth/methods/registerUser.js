import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

Meteor.methods({
  'auth.registerUser'({ username, email, password }) {
    check(username, String);
    check(email, String);
    check(password, String);

    if (username.trim().length < 3) {
      throw new Meteor.Error('auth.invalidUsername', 'Username must be at least 3 characters.');
    }

    if (password.length < 6) {
      throw new Meteor.Error('auth.invalidPassword', 'Password must be at least 6 characters.');
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