import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { check } from 'meteor/check';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  'game.drawCards': async function ({ uniqueCardId }) {
    check(uniqueCardId, String);

    if (!this.userId) {
      throw new Meteor.Error(
        'game.drawCards.notLoggedIn',
        'Must be logged in to draw cards.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) {
      throw new Meteor.Error(
        'game.drawCards.noUserData',
        'No user data found.'
      );
    }

    const engine = new GameEngine(userData.gameState);
    return engine.drawCost(uniqueCardId);
  },
});
