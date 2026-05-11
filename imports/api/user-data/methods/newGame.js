import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  /**
   * Starts a fresh game for the logged-in user, resetting deck, hand, and enemy.
   * Creates a UserData document if one does not yet exist (e.g. first login after registration).
   */
  'game.newGame': async function () {
    if (!this.userId) {
      throw new Meteor.Error('game.newGame.notLoggedIn', 'Must be logged in to start a game.');
    }

    const gameState = GameEngine.newGame(this.userId);
    const existing = await UserDataCollection.findOneAsync({ userId: this.userId });

    if (existing) {
      await UserDataCollection.updateAsync(
        { userId: this.userId },
        { $set: { gameState } }
      );
    } else {
      await UserDataCollection.insertAsync({ userId: this.userId, gameState });
    }
  },
});
