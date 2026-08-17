import { Meteor } from 'meteor/meteor';

/**
 * Marks the currently authenticated user as having seen the tutorial.
 *
 * Persisted on the user's profile so the tutorial overlay only
 * auto-triggers once per account, across sessions/devices, rather than
 * relying on any client-only state. `profile.hasSeenTutorial` is already
 * exposed to the client via the existing `auth.currentUser` publication,
 * which publishes the full `profile` field.
 *
 * @author Hydar Rabiaa
 * @version 1.0
 * @method user.markTutorialSeen
 *
 * @throws {Meteor.Error} user.markTutorialSeen.notLoggedIn
 * Thrown when there is no authenticated user.
 */
Meteor.methods({
  'user.markTutorialSeen': async function () {
    if (!this.userId) {
      throw new Meteor.Error(
        'user.markTutorialSeen.notLoggedIn',
        'Must be logged in.'
      );
    }

    await Meteor.users.updateAsync(
      { _id: this.userId },
      { $set: { 'profile.hasSeenTutorial': true } }
    );
  },
});