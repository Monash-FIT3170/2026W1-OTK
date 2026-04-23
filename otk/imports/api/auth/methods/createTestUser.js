import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  async 'auth.createTestUser'({ username, email, password, profile = {} }) {
    const existingUser = await Meteor.users.findOneAsync({
      $or: [
        { username },
        { 'emails.address': email },
      ],
    });

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

  async 'auth.clearTestUsers'() {
    return await Meteor.users.removeAsync({});
  },
});