import { Meteor } from "meteor/meteor";
import { UserDataCollection } from "./collections/UserDataCollection";

// Meteor.publish only exists on the server. This module is reached from the
// client test bundle via tests/main.js, so the registration must be guarded.
if (Meteor.isServer) {
  Meteor.publish("userData", function () {
    const userId = this.userId;
    if (!userId) {
      return this.ready();
    }
    return UserDataCollection.find({ userId });
  });

  // Leaderboard: top 10 Training Mode scores across all players, by
  // trainingHighScore. Only two fields are published (plus userId, so the
  // client can tell which row is the logged-in player's own) — never the
  // rest of a user's document, which can include an in-progress run's
  // hand/deck/enemy state. username is a denormalised copy kept in sync by
  // userData.saveTrainingHighScore, so this needs no join against
  // Meteor.users. A player's own rank outside the top 10 is served
  // separately by the userData.getMyTrainingRank method, not published
  // here, to avoid handing the client every player's score just to work
  // out where one player sits among them.
  Meteor.publish("leaderboard.topTrainingScores", function () {
    if (!this.userId) {
      return this.ready();
    }

    return UserDataCollection.find(
      { trainingHighScore: { $gt: 0 } },
      {
        sort: { trainingHighScore: -1 },
        limit: 10,
        fields: { userId: 1, username: 1, trainingHighScore: 1 },
      }
    );
  });
}