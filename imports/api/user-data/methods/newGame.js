import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  /**
   * Starts a fresh game for the logged-in user, resetting deck, hand, and enemy.
   * Creates a UserData document if one does not yet exist (e.g. first login after registration).
   */
  'game.newGame': async function (difficulty = 'easy') {
    if (!this.userId) {
      throw new Meteor.Error('game.newGame.notLoggedIn', 'Must be logged in to start a game.');
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      throw new Meteor.Error('game.newGame.invalidDifficulty', 'Unknown difficulty.');
    }

    const existing = await UserDataCollection.findOneAsync({ userId: this.userId });
    const deck = existing?.nextDeck ?? null;

    // seenDialogue is account-level (top of the document, outside gameState),
    // so it survives the gameState overwrite below and a restarted run skips
    // dialogue the player has already watched.
    const gameState = GameEngine.newGame(this.userId, deck, difficulty, existing?.seenDialogue);

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
