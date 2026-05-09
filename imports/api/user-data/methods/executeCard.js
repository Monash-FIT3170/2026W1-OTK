import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { check, Match } from 'meteor/check';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  'game.executeCard': async function ({ cardId, selectedCardIds }) {
    check(cardId, String);
    check(selectedCardIds, Match.Optional([String]));

    if (!this.userId) {
      throw new Meteor.Error(
        'game.executeCard.notLoggedIn',
        'Must be logged in to execute a card.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) {
      throw new Meteor.Error(
        'game.executeCard.noUserData',
        'No user data found.'
      );
    }

    const engine = new GameEngine(userData.gameState);
    engine.executeCard(cardId, selectedCardIds ?? []);

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: engine.toJSON() } }
    );
  },
});
