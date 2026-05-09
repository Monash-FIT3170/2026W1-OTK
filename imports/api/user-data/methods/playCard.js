import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { check } from 'meteor/check';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  'game.playCard': async function ({ cardId }) {
    check(cardId, String);

    if (!this.userId) {
      throw new Meteor.Error(
        'game.playCard.notLoggedIn',
        'Must be logged in to play a card.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) {
      throw new Meteor.Error('game.playCard.noUserData', 'No user data found.');
    }

    const engine = new GameEngine(userData.gameState);
    engine.playCard(cardId);

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: engine.toJSON() } }
    );
  },
});
