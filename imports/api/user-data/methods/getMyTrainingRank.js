import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';

/**
 * Returns the authenticated user's global rank by trainingHighScore, for
 * the Leaderboard screen to show "Your rank: #N" even when the player
 * isn't in the visible top 10 (see leaderboard.topTrainingScores in
 * UserDataPublications.js, which only ever publishes the top 10).
 *
 * Deliberately a method rather than a publication: computing a rank only
 * needs a point-in-time count, not a live cursor, and a method avoids
 * publishing every other player's trainingHighScore to the client just to
 * work out where one player sits among them.
 *
 * @method userData.getMyTrainingRank
 *
 * @returns {null | { rank: number, score: number }}
 * null if the player hasn't set a Training Mode score yet (nothing to
 * rank); otherwise their 1-based rank and their current score.
 *
 * @throws {Meteor.Error} userData.notAuthorized
 * Thrown when an unauthenticated user calls this method.
 */
Meteor.methods({
  'userData.getMyTrainingRank': async function () {
    if (!this.userId) {
      throw new Meteor.Error(
        'userData.notAuthorized',
        'You must be logged in to view your rank.'
      );
    }

    const myData = await UserDataCollection.findOneAsync(
      { userId: this.userId },
      { fields: { trainingHighScore: 1 } }
    );
    const myScore = myData?.trainingHighScore ?? 0;

    if (myScore <= 0) {
      return null;
    }

    const higherScoreCount = await UserDataCollection.find({
      trainingHighScore: { $gt: myScore },
    }).countAsync();

    return { rank: higherScoreCount + 1, score: myScore };
  },
});
