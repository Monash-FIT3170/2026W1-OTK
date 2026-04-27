import { Meteor } from 'meteor/meteor';

/**
 * Publishes the currently authenticated user's data.
 *
 * This publication returns a limited subset of fields from the
 * `Meteor.users` collection for the logged-in user only.
 *
 * Behaviour:
 * - If no user is logged in (`this.userId` is null), the publication
 *   immediately signals readiness without returning any data.
 * - If a user is logged in, only that user's document is returned.
 *
 * Security Considerations:
 * - Only the authenticated user's data is exposed
 * - Only selected fields are published (username, email, profile)
 * - Prevents access to other users' data
 *
 * @publication auth.currentUser
 *
 * @returns {Mongo.Cursor | this.ready()}
 * - Cursor containing the current user's data
 * - OR an empty ready state if not logged in
 */
Meteor.publish('auth.currentUser', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find(
    { _id: this.userId },
    {
      fields: {
        username: 1,
        emails: 1,
        profile: 1,
      },
    }
  );
});