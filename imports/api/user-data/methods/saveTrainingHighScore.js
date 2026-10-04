import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { UserDataCollection } from '../collections/UserDataCollection';

/**
 * Records the authenticated user's best single Training Mode session —
 * the most damage they've dealt to the Training Dummy before choosing to
 * exit. Also keeps a denormalised copy of their username on the same
 * document (see leaderboard.topTrainingScores in UserDataPublications.js),
 * so the leaderboard can be served from a single UserDataCollection cursor
 * instead of a reactive join against Meteor.users.
 *
 * Called once, when the player exits Training Mode, with that session's
 * final damage total. Only ever raises the stored score — a lower or
 * equal total for this session is silently ignored, so a player can never
 * lose their existing best by training again and doing worse. The
 * username is kept in sync on every call regardless (cheap, and covers
 * both a changed username and a score saved before this field existed).
 *
 * @method userData.saveTrainingHighScore
 *
 * @param {number} sessionDamage - Total damage dealt to the Training
 *   Dummy during the session that just ended. Must be a non-negative
 *   number.
 *
 * @throws {Meteor.Error} userData.notAuthorized
 * Thrown when an unauthenticated user attempts to save a score.
 *
 * @throws {Meteor.Error} userData.notFound
 * Thrown when no user data exists for the authenticated user.
 *
 * @see UserDataCollection
 */
Meteor.methods({
  'userData.saveTrainingHighScore': async function (sessionDamage) {
    check(sessionDamage, Match.Where((value) => {
      check(value, Number);
      return value >= 0;
    }));

    if (!this.userId) {
      throw new Meteor.Error(
        'userData.notAuthorized',
        'You must be logged in to save a training score.'
      );
    }

    const existingUserData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });

    if (!existingUserData) {
      throw new Meteor.Error(
        'userData.notFound',
        'No user data exists for this user.'
      );
    }

    const user = await Meteor.users.findOneAsync(
      { _id: this.userId },
      { fields: { username: 1 } }
    );
    const username = user?.username ?? 'Player';

    const currentBest = existingUserData.trainingHighScore ?? 0;
    if (sessionDamage <= currentBest) {
      // Not a new personal best, but keep the leaderboard-facing username
      // field current (it may not exist yet on an older document, or the
      // player may have changed their username since it was last set).
      if (existingUserData.username !== username) {
        await UserDataCollection.updateAsync(
          { userId: this.userId },
          { $set: { username } }
        );
      }
      return currentBest;
    }

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { trainingHighScore: sessionDamage, username } }
    );

    return sessionDamage;
  },
});