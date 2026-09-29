import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { UserDataCollection } from '../collections/UserDataCollection';

/**
 * Records the authenticated user's best single Training Mode session —
 * the most damage they've dealt to the Training Dummy before choosing to
 * exit. This is the minimum persistence needed to eventually rank players
 * on a "Most Damage Dealt" leaderboard; the leaderboard read side (a
 * publication sorted across all users' trainingHighScore) is a separate,
 * later piece of work.
 *
 * Called once, when the player exits Training Mode, with that session's
 * final damage total. Only ever raises the stored score — a lower or
 * equal total for this session is silently ignored, so a player can never
 * lose their existing best by training again and doing worse.
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

    const currentBest = existingUserData.trainingHighScore ?? 0;
    if (sessionDamage <= currentBest) {
      // Not a new personal best - nothing to update.
      return currentBest;
    }

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { trainingHighScore: sessionDamage } }
    );

    return sessionDamage;
  },
});